import { HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, switchMap, tap } from 'rxjs';

import { environment } from '../../http/environment/environment';
import { TokenStorage } from './token.storage';
import { SignupRequest, SignupResponse } from '../models';
import { Api } from '../../http/services/api/api';
import { CustomerService } from '../../services/customer/customer.service';
import { Router } from '@angular/router';
import { TokenService } from './token-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = environment.apiUrl;
  private project_key = environment.projectKey;

  private storage = inject(TokenStorage);
  private apiService = inject(Api);
  private customerService = inject(CustomerService);
  private router = inject(Router);
  private tokenService = inject(TokenService);


  initAuthFlow() {
    const customerToken = this.storage.getCurrentCustomerToken();

    if (customerToken) {
      return this.customerService.getMe().pipe(
        tap((customer) => this.customerService.customer.set(customer)),
        map(() => customerToken),
      );
    }

    const anonToken = this.storage.getCurrentAnonymousToken();

    if (anonToken) {
      return of(anonToken);
    }

    return this.tokenService.getAnonymousToken().pipe(map((token) => token.access_token));
  }

  signup(data: SignupRequest): Observable<SignupResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.apiService
      .post<SignupResponse>(`${this.url}/${this.project_key}/me/signup`, data, headers)
      .pipe(
        tap((res) => {
          this.customerService.customer.set(res.customer);
        }),
      );
  }

  signIn(signupPayload: { email: string; password: string }) {
    return this.tokenService
      .getCustomerToken(signupPayload)
      .pipe(switchMap(() => this.customerService.getMe()));
  }

  logout(): void {
    this.storage.clearTokens();
    this.customerService.customer.set(null);

    this.tokenService.getAnonymousToken().subscribe();
    this.router.navigate(['/']);
  }
}
