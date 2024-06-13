import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PRODUCT_API_ENDPOINTS } from 'src/app/core/global/constants/api-endpoints';
import { ProductRequest, ProductResponse } from 'src/app/shared/models/interfaces/product.interface';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private uri = environment.url

  constructor(private http: HttpClient) { }

  private handleImage(image: string): string {
    let imagePrefix = 'data:image/jpeg;base64,';
    if (image.startsWith('iVBOR')) {
      imagePrefix = 'data:image/png;base64,';
    } else if (image.startsWith('UklGR')) {
      imagePrefix = 'data:image/webp;base64,';
    }
    return imagePrefix + image;
  }

  private handleProductData(product: ProductResponse) {
    if (product.image) {
      product.image = this.handleImage(product.image);
    }
    return product;
  }

  getProduct(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${this.uri}/${PRODUCT_API_ENDPOINTS.GET_ALL}`).pipe(
      map((products: ProductResponse[]) => products.map(product => this.handleProductData(product)))
    );
  }

  createProduct(product: ProductRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.uri}/${PRODUCT_API_ENDPOINTS.CREATE}`, product).pipe(
      map((newProduct: ProductResponse) => this.handleProductData(newProduct))
    );
  }
}
