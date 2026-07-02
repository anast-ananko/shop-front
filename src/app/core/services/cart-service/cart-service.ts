import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { Cart } from '../../../types/cart.interface';
import { environment } from '../../http/environment/environment';
import { Api } from '../../http/services/api/api';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiService = inject(Api);
  private url = environment.apiUrl;
  private project_key = environment.projectKey;

  cart = signal<Cart | null>(null);

  getActiveCart(): Observable<Cart> {
    return this.apiService.get<Cart>(`${this.url}/${this.project_key}/me/active-cart`).pipe(
      tap((cart) => {
        this.cart.set(this.mapCart(cart));
        console.log('Active cart fetched:', this.cart());
      }),
    );
  }

  createCart(): Observable<Cart> {
    return this.apiService
      .post<Cart>(`${this.url}/${this.project_key}/me/carts`, {
        currency: 'USD',
        country: 'US',
      })
      .pipe(
        tap((cart) => {
          this.cart.set(this.mapCart(cart));
          console.log('Cart created:', this.cart());
        }),
      );
  }

  initCart(): Observable<Cart> {
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
