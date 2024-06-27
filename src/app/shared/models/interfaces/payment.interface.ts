import { ProductToPay } from "./product.interface";

export interface PaymentIntentDto {
  token: string;
  description: string;
  amount: number;
  currency: string;
  products: ProductToPay[];
  clientId: number;
}
