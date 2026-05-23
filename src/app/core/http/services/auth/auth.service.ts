import { HttpHeaders, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environment/environment';
import { TokenStorage } from './token.storage';
import { AppToken, SignupRequest, SignupResponse, Token } from './models';
import { Api } from '../api/api';

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

  authState = signal<'guest' | 'customer' | 'loading'>('loading');

  isAuth = computed(() => this.authState() === 'customer');
  isGuest = computed(() => this.authState() === 'guest');

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
      this.authState.set('customer');
      return;
    }

    const anon = this.storage.getAnonymousToken();
    if (anon) {
      this.authState.set('guest');
      return;
    }

    this.authState.set('loading');

    this.getAnonymousToken().subscribe(() => {
      this.authState.set('guest');
    });
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

          this.authState.set('guest');
        }),
      );
  }

  getCustomerToken(email: string, password: string): Observable<Token> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', email)
      .set('password', password)
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

          this.authState.set('customer');
        }),
      );
  }

  signup(data: SignupRequest): Observable<SignupResponse> {
    const token = this.storage.getAppToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.apiService.post<SignupResponse>(
      `${this.url}/${this.project_key}me/signup`,
      data,
      headers,
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

  // logout(): void {
  //   this.storage.clearTokens();
  //   this.authState.set('loading');

  //   this.getAnonymousToken().subscribe(() => {
  //     this.authState.set('guest');
  //   });
  // }
}
