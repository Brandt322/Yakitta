import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { ProductService } from 'src/app/services/product/product.service';
import { SharedProductCart } from 'src/app/shared/components/services/shared-product-cart.service';
import { Product, ProductResponse } from 'src/app/shared/models/interfaces/product.interface';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: ProductResponse[] = [];

  constructor(
    private productService: ProductService,
    private primengConfig: PrimeNGConfig,
    private sharedProductCartService: SharedProductCart,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getProducts();
    this.primengConfig.ripple = true;
  }

  getProducts() {
    this.productService.getProduct()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error al cargar los productos: ${error.name} ${error.statusText}` });
          return throwError(() => error);
        })
      ).subscribe((products: ProductResponse[]) => {
        this.products = products;
      });
  }

  addProductToCart(product: Product) {
    this.sharedProductCartService.addProduct(product);
  }
}
