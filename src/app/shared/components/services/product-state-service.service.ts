import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
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
      }),
      catchError(error => {
        // console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  updateProduct(id: number, product: ProductRequest): Observable<Object> {
    return this.productService.updateProduct(id, product).pipe(
      tap((updatedProduct: ProductResponse) => {
        const currentProducts = this.productsSubject.getValue();
        const updatedProducts = currentProducts.map(product => product.id === id ? updatedProduct : product);
        this.productsSubject.next(updatedProducts);
      }),
      catchError(error => {
        // console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  deleteProduct(id: number): Observable<String> {
    return this.productService.deleteProduct(id).pipe(
      tap(() => {
        const currentProducts = this.productsSubject.getValue();
        const updatedProducts = currentProducts.filter(product => product.id !== id);
        this.productsSubject.next(updatedProducts);
      }),
      catchError(error => {
        // console.error('Error:', error);
        return throwError(error);
      })
    );
  }
}
