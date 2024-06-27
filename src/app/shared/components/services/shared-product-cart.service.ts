import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Product } from '../../models/interfaces/product.interface';
import { ProductService } from 'src/app/services/product/product.service';

@Injectable({
  providedIn: 'root'
})
export class SharedProductCart {

  private productList: { product: Product; quantity: number }[] = [];
  private myCart = new BehaviorSubject<{ product: Product; quantity: number }[]>([]);
  mycart$ = this.myCart.asObservable();
  private userId: string | null = null;

  constructor(private productService: ProductService) { }

  private saveCartToLocalStorage() {
    localStorage.setItem('myCart', JSON.stringify(this.productList));
  }

  public initializeCart(userId: string) {
    this.userId = userId;
    this.loadCartFromLocalStorage();
    this.validateAndUpdateCart();
  }

  public loadCartFromLocalStorage() {
    const cart = localStorage.getItem('myCart');
    this.productList = cart ? JSON.parse(cart) : [];
    this.myCart.next(this.productList); // Actualiza el BehaviorSubject con los productos cargados
  }

  public validateAndUpdateCart() {
    this.productService.getProduct()
      .pipe(
        map(products => this.productList.map(cartItem => {
          const currentProduct = products.find(p => p.id === cartItem.product.id);
          if (!currentProduct || currentProduct.stock === 0) {
            return null; // Eliminar producto si ya no está disponible o sin stock.
          } else if (currentProduct.stock < cartItem.quantity) {
            return { ...cartItem, quantity: currentProduct.stock }; // Ajustar cantidad según stock disponible.
          }
          return cartItem;
        }).filter(item => item !== null) as { product: Product; quantity: number; }[]),
        tap(updatedCart => {
          this.productList = updatedCart;
          this.myCart.next(this.productList);
          this.saveCartToLocalStorage();
        })
      ).subscribe();
  }

  validateStockBeforePurchase(): Observable<{ isStockAvailable: boolean, outOfStockProducts: string[], insufficientStockProducts: string[] }> {
    return this.productService.getProduct().pipe(
      map(products => {
        let outOfStockProducts = [];
        let insufficientStockProducts = [];
        for (let cartItem of this.productList) {
          const product = products.find(p => p.id === cartItem.product.id);
          if (product!.stock === 0) {
            outOfStockProducts.push(cartItem.product.name); // Producto no encontrado, se considera sin stock
          } else if (product!.stock < cartItem.quantity) {
            insufficientStockProducts.push(cartItem.product.name); // Stock insuficiente para la cantidad deseada
          }
        }
        return {
          isStockAvailable: outOfStockProducts.length === 0 && insufficientStockProducts.length === 0,
          outOfStockProducts: outOfStockProducts,
          insufficientStockProducts: insufficientStockProducts
        };
      })
    );
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

  isProductInCart(productId: number): boolean {
    return this.productList.some(p => p.product.id === productId);
  }

}
