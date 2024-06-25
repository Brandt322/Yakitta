import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../models/interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class SharedProductCart {

  private productList: { product: Product; quantity: number }[] = [];
  private myCart = new BehaviorSubject<{ product: Product; quantity: number }[]>([]);
  mycart$ = this.myCart.asObservable();
  private userId: string | null = null;

  constructor() { }

  private saveCartToLocalStorage() {
    localStorage.setItem('myCart', JSON.stringify(this.productList));
  }

  public initializeCart(userId: string) {
    this.userId = userId;
    this.loadCartFromLocalStorage();
  }

  public loadCartFromLocalStorage() {
    const cart = localStorage.getItem('myCart');
    this.productList = cart ? JSON.parse(cart) : [];
    this.myCart.next(this.productList); // Actualiza el BehaviorSubject con los productos cargados
  }

  addProduct(product: Product) {
    const productIndex = this.productList.findIndex(p => p.product.id === product.id);
    if (productIndex !== -1) {
      this.productList[productIndex].quantity += 1;
    } else {
      this.productList.push({ product, quantity: 1 });
    }
    this.myCart.next(this.productList);
    this.saveCartToLocalStorage();
    // console.log(this.productList);
  }

  updateProductQuantity(productId: number, quantity: number) {
    const productIndex = this.productList.findIndex(p => p.product.id === productId);
    if (productIndex !== -1) {
      this.productList[productIndex].quantity = quantity;
      this.myCart.next(this.productList);
      this.saveCartToLocalStorage();
    }
  }

  increaseProductQuantity(productId: number) {
    const productIndex = this.productList.findIndex(p => p.product.id === productId);
    if (productIndex !== -1) {
      this.productList[productIndex].quantity += 1;
      this.myCart.next(this.productList);
      this.saveCartToLocalStorage();
    }
  }

  decreaseProductQuantity(productId: number) {
    const productIndex = this.productList.findIndex(p => p.product.id === productId);
    if (productIndex !== -1) {
      this.productList[productIndex].quantity = Math.max(1, this.productList[productIndex].quantity - 1);
      this.myCart.next(this.productList);
      this.saveCartToLocalStorage();
    }
  }

  removeProduct(productId: number) {
    this.productList = this.productList.filter(p => p.product.id !== productId);
    this.myCart.next(this.productList);
    this.saveCartToLocalStorage();
  }
}
