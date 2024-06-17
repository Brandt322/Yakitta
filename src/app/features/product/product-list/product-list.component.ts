import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { ProductService } from 'src/app/services/product/product.service';
import { ProductResponse } from 'src/app/shared/models/interfaces/product.interface';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: ProductResponse[] = [];

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getProducts()
  }

  getProducts() {
    this.productService.getProduct()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.toastr.error(`Error al cargar los productos: ${error.name} ${error.statusText}`, 'Error');
          return throwError(() => error);
        })
      ).subscribe((products: ProductResponse[]) => {
        this.products = products;
      });
  }
}
