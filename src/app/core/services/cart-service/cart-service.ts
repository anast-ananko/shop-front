import { effect, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, tap } from 'rxjs';
import { Cart, CartStorage } from '../../../types/cart.interface';
import { environment } from '../../http/environment/environment';
import { Api } from '../../http/services/api/api';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiService = inject(Api);
  private url = environment.apiUrl;
  private project_key = environment.projectKey;
  readonly cart = signal<Cart | null>(null);
  private readonly CART_STORAGE_KEY = 'cart';

  constructor() {
    effect(() => {
      const cart = this.cart();

      if (!cart) {
        localStorage.removeItem(this.CART_STORAGE_KEY);
        return;
      }

      const cartData = JSON.stringify({
        id: cart.id,
        anonymousId: cart.anonymousId,
      });

      localStorage.setItem(this.CART_STORAGE_KEY, cartData);
    });
  }

  getActiveCart(): Observable<Cart> {
    return this.apiService
      .get<Cart>(`${this.url}/${this.project_key}/me/active-cart`)
      .pipe(tap((cart) => this.cart.set(this.mapCart(cart))));
  }

  createCart(): Observable<Cart> {
    return this.apiService
      .post<Cart>(`${this.url}/${this.project_key}/me/carts`, {
        currency: 'USD',
        country: 'US',
      })
      .pipe(tap((cart) => this.cart.set(this.mapCart(cart))));
  }

  getCartById(cartId: string): Observable<Cart> {
    return this.apiService.get<Cart>(`/carts/${cartId}`).pipe(map((cart) => this.mapCart(cart)));
  }

  initCart(): Observable<Cart> {
    const savedCart = localStorage.getItem(this.CART_STORAGE_KEY);
    console.log(savedCart);

    if (savedCart) {
      console.log("its works");
      const { id } = JSON.parse(savedCart) as CartStorage;
      return this.getCartById(id).pipe(
        catchError(() => this.getActiveCart()),
        catchError((error) => {
          if (error.status === 404) return this.createCart();
          throw error;
        }),
      );
    }

    return this.getActiveCart().pipe(
      catchError((error) => {
        if (error.status === 404) return this.createCart();
        throw error;
      }),
    );
  }

  private mapCart(cart: Cart): Cart {
    return {
      id: cart.id,
      version: cart.version,
      anonymousId: cart.anonymousId,
      lineItems: cart.lineItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalPrice: {
        currencyCode: cart.totalPrice.currencyCode,
        centAmount: cart.totalPrice.centAmount,
        fractionDigits: cart.totalPrice.fractionDigits,
      },

      totalLineItemQuantity: cart.lineItems.reduce((sum, item) => sum + item.quantity, 0),
    };
  }
}
