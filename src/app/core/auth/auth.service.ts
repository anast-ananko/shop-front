import { HttpHeaders, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';

import { environment } from '../http/environment/environment';
import { TokenStorage } from './token.storage';
import { AppToken, SignupRequest, SignupResponse, Token } from './models';
import { Api } from '../http/services/api/api';
import { CustomerService } from '../services/customer/customer.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = environment.authUrl;
  private url = environment.apiUrl;
  private project_key = environment.projectKey;
  private client_id = environment.clientId;
  private secret = environment.clientSecret;
  private scope = environment.scope;

  private storage = inject(TokenStorage);
  private apiService = inject(Api);
  private customerService = inject(CustomerService);
  private router = inject(Router);
  private getClientCredentialsBody(): string {
    return new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('scope', this.scope)
      .toString();
  }

  private getBasicHeaders(): HttpHeaders {
    const basicAuth = btoa(`${this.client_id}:${this.secret}`);
    return new HttpHeaders({
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    });
  }

  isAuth = computed(() => !!this.customerService.customer());
  isGuest = computed(() => this.customerService.customer() === null);

  initAuthFlow() {
    const customerToken = this.storage.getCustomerToken();
    if (customerToken) {
      this.customerService
        .getMe()
        .pipe(tap((customer) => this.customerService.customer.set(customer)))
        .subscribe();
      return;
    }

    const anonToken = this.storage.getAnonymousToken();
    if (anonToken) return;

    this.getAnonymousToken().subscribe();
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
    return this.getCustomerToken(signupPayload)
      .pipe(switchMap(() => this.customerService.getMe()));
  }

  logout(): void {
    this.storage.clearTokens();
    this.customerService.customer.set(null);

    this.getAnonymousToken().subscribe();
    this.router.navigate(['/']);
  }

  // --------------- get tokens ---------------

  getAccessToken(): Observable<AppToken> {
    return this.apiService
      .post<AppToken>(
        `${this.authUrl}/oauth/token`,
        this.getClientCredentialsBody(),
        this.getBasicHeaders(),
      )
      .pipe(tap((res) => this.storage.setAppToken(res.access_token)));
  }

  getAnonymousToken(): Observable<Token> {
    return this.apiService
      .post<Token>(
        `${this.authUrl}/oauth/${this.project_key}/anonymous/token`,
        this.getClientCredentialsBody(),
        this.getBasicHeaders(),
      )
      .pipe(
        tap((res) => {
          this.storage.setAnonymousToken(res.access_token);
          this.storage.setRefreshToken(res.refresh_token);
        }),
      );
  }

  getCustomerToken(dto: { email: string; password: string }): Observable<Token> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', dto.email)
      .set('password', dto.password)
      .set('scope', this.scope);

    return this.apiService
      .post<Token>(
        `${this.authUrl}/oauth/${this.project_key}/customers/token`,
        body.toString(),
        this.getBasicHeaders(),
      )
      .pipe(
        tap((res) => {
          this.storage.setCustomerToken(res.access_token);
          this.storage.setRefreshToken(res.refresh_token);
          this.storage.deleteAnonymousToken();
        }),
      );
  }
}
