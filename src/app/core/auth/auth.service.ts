import { HttpHeaders, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../http/environment/environment';
import { TokenStorage } from './token.storage';
import { AppToken, Customer, SignupRequest, SignupResponse, Token } from './models';
import { Api } from '../http/services/api/api';

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

  customer = signal<Customer | null>(null);

  isAuth = computed(() => !!this.customer());
  isGuest = computed(() => this.customer() === null);

  getAccessToken(): Observable<AppToken> {
    const body = new HttpParams().set('grant_type', 'client_credentials').set('scope', this.scope);

    const basicAuth = btoa(`${this.client_id}:${this.secret}`);
    const headers = new HttpHeaders({
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.apiService
      .post<AppToken>(`${this.authUrl}/oauth/token`, body.toString(), headers)
      .pipe(tap((res) => this.storage.setAppToken(res.access_token)));
  }

  initAuthFlow() {
    const customer = this.storage.getCustomerToken();
    if (customer) {
      return;
    }

    const anon = this.storage.getAnonymousToken();
    if (anon) {
      return;
    }

    this.getAnonymousToken().subscribe();
  }

  getAnonymousToken(): Observable<Token> {
    const body = new HttpParams().set('grant_type', 'client_credentials').set('scope', this.scope);

    const basicAuth = btoa(`${this.client_id}:${this.secret}`);
    const headers = new HttpHeaders({
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.apiService
      .post<Token>(
        `${this.authUrl}/oauth/${this.project_key}/anonymous/token`,
        body.toString(),
        headers,
      )
      .pipe(
        tap((res) => {
          this.storage.setAnonymousToken(res.access_token);
          this.storage.setRefreshToken(res.refresh_token);
        }),
      );
  }

  getCustomerToken(dto: {email: string, password: string}): Observable<Token> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', dto.email)
      .set('password', dto.password)
      .set('scope', this.scope);

    const basicAuth = btoa(`${this.client_id}:${this.secret}`);
    const headers = new HttpHeaders({
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.apiService
      .post<Token>(
        `${this.authUrl}/oauth/${this.project_key}/customers/token`,
        body.toString(),
        headers,
      )
      .pipe(
        tap((res) => {
          this.storage.setCustomerToken(res.access_token);
          this.storage.setRefreshToken(res.refresh_token);
          this.storage.deleteAnonymousToken();
        }),
      );
  }

  signup(data: SignupRequest): Observable<SignupResponse> {
    const token = this.storage.getAppToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.apiService
      .post<SignupResponse>(`${this.url}/${this.project_key}/me/signup`, data, headers)
      .pipe(
        tap((res) => {
          this.customer.set(res.customer);
        }),
      );
  }

  // refreshToken(): Observable<Token> | undefined {
  //   const refreshToken = this.storage.getRefreshToken();

  //   if (!refreshToken) {
  //     return; // to impove
  //   }

  //   const body = new URLSearchParams();
  //   body.set('grant_type', 'refresh_token');
  //   body.set('refresh_token', refreshToken);
  //   body.set('client_id', this.client_id);
  //   body.set('client_secret', this.secret);

  //   return this.http
  //     .post<Token>(`${this.authUrl}/oauth/token`, body.toString(), {
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //     })
  //     .pipe(
  //       tap((res) => {
  //         this.storage.setCustomerToken(res.access_token);

  //         this.authState.set('customer');
  //       }),
  //     );
  // }

  logout(): void {
    this.storage.clearTokens();
    this.customer.set(null);

    this.getAnonymousToken().subscribe();
  }
}
