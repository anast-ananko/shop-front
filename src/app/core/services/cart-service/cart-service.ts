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
  private cart = signal<Cart | null>(null);

  getActiveCart(): Observable<Cart> {
    return this.apiService
      .get<Cart>(`${this.url}/${this.project_key}/me/active-cart`)
      .pipe(tap((cart) => {
        console.log('Active cart fetched:', cart);
        this.cart.set(cart)
      }));
  }

  createCart(): Observable<Cart> {
    return this.apiService
      .post<Cart>(`${this.url}/${this.project_key}/me/carts`, {
        currency: 'USD',
        country: 'US',
      })
      .pipe(tap((cart) => {
        console.log('Cart created:', cart);
        this.cart.set(cart)
      }));
  }

  initCart(): Observable<Cart> {
    return this.getActiveCart().pipe(
      catchError((error) => {
        if (error.status === 404) {
          return this.createCart();
        }
        throw error;
      }),
    );
  }
}
