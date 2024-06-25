import { Brand } from "./brand.interface";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  discount: number;
  image: string;
  product_type: string;
  id_brands: Brand;
}

export interface ProductCart {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  discount: number;
  quantity: number;
  image: string;
  product_type: string;
  id_brands: Brand;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  discount: number;
  product_type: string;
  image: string;
  id_brands: Brand;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  discount: number;
  state: boolean;
  image: string;
  product_type: string;
  id_brands: Brand;
}
