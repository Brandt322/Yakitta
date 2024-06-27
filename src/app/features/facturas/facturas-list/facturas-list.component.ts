import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Order } from '@stripe/stripe-js';
import { MessageService } from 'primeng/api';
import { catchError, forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { UserService } from 'src/app/auth/services/user.service';
import { OrderService } from 'src/app/services/order/order.service';
import { UserPrincipal } from 'src/app/shared/models/interfaces/login.interface';
import { OrderDetail, OrderResponse } from 'src/app/shared/models/interfaces/order.interface';
import { Product } from 'src/app/shared/models/interfaces/product.interface';


interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-facturas-list',
  templateUrl: './facturas-list.component.html',
  styleUrls: ['./facturas-list.component.css']
})
export class FacturasListComponent implements OnInit {
  orders!: OrderResponse[];
  selectedOrder!: Product[];
  cols!: Column[];
  exportColumns!: ExportColumn[];
  userDetails!: UserPrincipal;
  visible: boolean = false;

  constructor(
    private orderService: OrderService,
    private messageService: MessageService,
    private userService: UserService,
    private authService: AuthenticationService
  ) { }


  ngOnInit(): void {
    this.getOrders();

    this.cols = [
      { field: 'idOrder', header: 'Codigo de orden', customExportHeader: 'Codigo de Orden' },
      { field: 'userName', header: 'Usuario' },
      { field: 'description', header: 'Descripción' },
      { field: 'amount', header: 'Precio total' },
      { field: 'date', header: 'Fecha de compra' } //orderDate pero formateado
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  getOrders() {
    const userRoles = this.authService.getAuthorities();
    let ordersObservable: Observable<OrderResponse[]> = of([]);

    if (userRoles.includes('ROLE_ADMIN')) {
      ordersObservable = this.orderService.getOrders();
    } else {
      if (sessionStorage.getItem('user_data')) {
        const userData = sessionStorage.getItem('user_data') ? JSON.parse(sessionStorage.getItem('user_data') || '{}') : {};
        this.userDetails = userData.userPrincipal;
        ordersObservable = this.orderService.getOrderByUser(this.userDetails.id_user);
      }
    }

    ordersObservable.pipe(
      catchError((error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error al cargar las ordenes: ${error.name} ${error.statusText}` });
        return throwError(() => error);
      }),
      switchMap((orders: OrderResponse[] | any) => {
        // Asegurarse de que 'orders' es un array antes de llamar a .map()
        if (!Array.isArray(orders)) {
          console.error('Expected an array of orders, but received:', orders);
          return of([]); // Devuelve un observable de un array vacío si 'orders' no es un array
        }
        if (orders.length === 0) return of([]);
        return forkJoin(
          orders.map(order =>
            this.userService.getOrderByUser(order.clientId).pipe(
              catchError(error => of(null)), // En caso de error, devuelve null para este usuario
              map(user => ({
                ...order,
                date: new Date(order.orderDate).toISOString().split('T')[0], // Formatea la fecha
                userName: user ? `${user.firstName[0].toUpperCase()}${user.firstName.slice(1)} ${user.lastName[0].toUpperCase()}${user.lastName.slice(1)}` : 'Usuario desconocido' // Combina y formatea el nombre
              }))
            )
          )
        );
      })
    ).subscribe((orders: OrderResponse[]) => {
      this.orders = orders;
    });
  }

  getOrderById(orderId: number) {
    this.orderService.getOrderById(orderId).subscribe((order: OrderResponse) => {

      this.selectedOrder = order.orderDetails.map(detail => {
        // Llama a handleImage para cada imagen de producto
        const imageWithPrefix = this.handleImage(detail.product.image);
        // Retorna el producto con la imagen actualizada
        return {
          ...detail.product,
          image: imageWithPrefix,
          quantity: detail.quantity
        };
      });
    });
  }

  exportPdf() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('p', 'px', 'a4');
        (doc as any).autoTable(this.exportColumns, this.orders);
        doc.save('orders.pdf');
      });
    });
  }

  showDialog(orderId: number) {
    this.getOrderById(orderId)
    this.visible = true;
  }

  private handleImage(image: string): string {
    let imagePrefix = 'data:image/jpeg;base64,';
    if (image.startsWith('iVBOR')) {
      imagePrefix = 'data:image/png;base64,';
    } else if (image.startsWith('UklGR')) {
      imagePrefix = 'data:image/webp;base64,';
    }
    return imagePrefix + image;
  }
}
