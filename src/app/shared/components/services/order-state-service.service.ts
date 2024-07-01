import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrderResponse } from '../../models/interfaces/order.interface';
import { OrderService } from 'src/app/services/order/order.service';

@Injectable({
  providedIn: 'root'
})
export class OrderStateService {
  private ordersSubject = new BehaviorSubject<OrderResponse[]>([]);
  orders$ = this.ordersSubject.asObservable();

  constructor(private orderService: OrderService) { }

  loadOrders() {
    this.orderService.getOrders().subscribe(orders => {
      this.ordersSubject.next(orders);
    });
  }

  loadOrdersByUser(userId: number) {
    this.orderService.getOrderByUser(userId).subscribe(orders => {
      this.ordersSubject.next(orders);
    });
  }

  getOrderById(orderId: number): Observable<OrderResponse> {
    // Aquí podríamos agregar lógica para filtrar el pedido por ID desde el estado actual si es necesario
    return this.orderService.getOrderById(orderId);
  }
}
