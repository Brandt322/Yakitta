import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { UserPrincipal } from 'src/app/shared/models/interfaces/login.interface';
import { SharedProductCart } from '../../services/shared-product-cart.service';
import { Product, ProductCart } from 'src/app/shared/models/interfaces/product.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger('sidebarAnimation', [
      state('open', style({
        transform: 'translateX(0%)'
      })),
      state('closed', style({
        transform: 'translateX(-100%)'
      })),
      transition('open => closed', [
        animate('250ms ease-out')
      ]),
      transition('closed => open', [
        animate('250ms ease-in')
      ])
    ])
  ]
})
export class MainComponent implements OnInit {
  userDetails!: UserPrincipal;
  sidebarVisible: boolean = false;
  profileVisible: boolean = false;
  isMobile = window.innerWidth < 992;
  myCart$ = this.sharedProductCartService.mycart$;
  products: ProductCart[] = [];
  tempQuantities: any = {};

  @ViewChild('mainContainer') mainContainer!: ElementRef;

  constructor(
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private authService: AuthenticationService,
    private sharedProductCartService: SharedProductCart,
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.sidebarVisible = true

    if (sessionStorage.getItem('user_data')) {
      const userData = sessionStorage.getItem('user_data') ? JSON.parse(sessionStorage.getItem('user_data') || '{}') : {};
      this.userDetails = userData.userPrincipal;
      this.sharedProductCartService.initializeCart(this.userDetails.id_user.toString());
    }

    this.sharedProductCartService.mycart$.subscribe(productList => {
      this.products = productList.map(item => ({
        ...item.product,
        quantity: item.quantity
      }));
    });
  }

  onQuantityInput(event: any, productId: number) {
    this.tempQuantities[productId] = event.value;
  }

  updateQuantityOnBlur(productId: number) {
    const quantity = this.tempQuantities[productId];
    if (quantity !== undefined) {
      this.updateQuantity(productId, quantity);
      delete this.tempQuantities[productId]; // Limpia la entrada temporal
    }
  }

  updateQuantity(productId: number, quantity: number) {
    this.sharedProductCartService.updateProductQuantity(productId, quantity);
  }

  increaseQuantity(product: any) {
    this.sharedProductCartService.increaseProductQuantity(product.id);
  }

  decreaseQuantity(product: any) {
    this.sharedProductCartService.decreaseProductQuantity(product.id);
  }

  removeProduct(product: any) {
    this.sharedProductCartService.removeProduct(product.id);
  }

  toogleProfile() {
    this.profileVisible = !this.profileVisible;
  }

  toogleSidebar(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.sidebarVisible = !this.sidebarVisible;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.mainContainer) {
      const clickedInside = this.mainContainer.nativeElement.contains(event.target);
      if (!clickedInside && this.isMobile && this.sidebarVisible) {
        this.sidebarVisible = false;
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const viewportWidth = event.target.innerWidth;
    this.isMobile = window.innerWidth < 992;
    // Si la ventana es menor a 992px, oculta el sidebar
    if (viewportWidth < 992) {
      this.sidebarVisible = false;
    } else {
      // Si la ventana es mayor o igual a 992px, muestra el sidebar
      this.sidebarVisible = true;
    }
  }

  onButtonClickProducts() {
    this.router.navigate(['/main']);
  }

  onButtonClickFacturas() {
    this.router.navigate(['/main/facturas']);
  }

  onButtonClickDashboard() {
    this.router.navigate(['/main/dashboard/products']);
  }

  logout(): void {
    this.authService.logout();
  }

}
