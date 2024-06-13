import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ProductRequest, ProductResponse } from '../../models/interfaces/product.interface';
import { ProductService } from 'src/app/services/product/product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductStateServiceService {

  private productsSubject: BehaviorSubject<ProductResponse[]> = new BehaviorSubject<ProductResponse[]>([]);
  products$: Observable<ProductResponse[]> = this.productsSubject.asObservable();

  constructor(private productService: ProductService) { }

  loadProducts(): void {
    this.productService.getProduct().subscribe((products: ProductResponse[]) => {
      this.productsSubject.next(products);
    });
  }

  createProduct(product: ProductRequest): Observable<Object> {
    return this.productService.createProduct(product).pipe(
      tap((newProduct: ProductResponse) => {
        const currentProducts = this.productsSubject.getValue();
        this.productsSubject.next([...currentProducts, newProduct]);
      })
    );
  }
}
