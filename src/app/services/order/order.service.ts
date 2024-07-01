import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ORDER_API_ENDPOINTS } from 'src/app/core/global/constants/api-endpoints';
import { OrderResponse } from 'src/app/shared/models/interfaces/order.interface';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private uri = environment.url

  constructor(private http: HttpClient) { }

  getOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.uri}/${ORDER_API_ENDPOINTS.GET_ALL}`);
  }

  getOrderById(orderId: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.uri}/${ORDER_API_ENDPOINTS.GET_BY_ID}/${orderId}`);
  }

  getOrderByUser(clientId: number): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.uri}/${ORDER_API_ENDPOINTS.GET_ALL_BY_USER}/${clientId}`);
  }

  updateOrderStatus(orderId: number, status: boolean): Observable<void> {
    return this.http.put<void>(`${this.uri}/${ORDER_API_ENDPOINTS.UPDATE_STATUS}/order/${orderId}/status`, status);
  }
}
