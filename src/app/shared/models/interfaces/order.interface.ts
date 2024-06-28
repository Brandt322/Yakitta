import { Product } from "./product.interface";

export interface OrderResponse {
  idOrder: number;
  clientId: number;
  orderDate: Date;
  description: string;
  amount: number;
  orderDetails: OrderDetail[];
}

export interface OrderDetail {
  idOrderDetail: number;
  order: number;
  product: Product;
  quantity: number;
  totalPrice: number;
}
