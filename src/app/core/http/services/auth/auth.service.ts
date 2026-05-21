import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable, tap } from 'rxjs';

import { TokenStorage } from './token.storage';
import { AppToken, MeResponse, SignupRequest, SignupResponse, Token } from './models';
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
  // private authUrl = 'https://auth.europe-west1.gcp.commercetools.com';
  // private url = 'https://api.europe-west1.gcp.commercetools.com';
  // private project_key = 'shopfront';
  // private client_id = 'isW51cIsrtg02i0ceKpdhnst';
  // private secret = 'jsgibB-2eztgo4_JgQEH_bT5nAfR6Ow9';

  private http = inject(HttpClient);
  private storage = inject(TokenStorage);
  private apiService = inject(Api);

  authState = signal<'guest' | 'customer' | 'loading'>('loading');

  isAuth = computed(() => this.authState() === 'customer');
  isGuest = computed(() => this.authState() === 'guest');

    getAccessToken() {
    const body = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('scope', this.scope);

    const basicAuth = btoa(`${this.client_id}:${this.secret}`);
    const headers = new HttpHeaders({
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.apiService.post<AppToken>(`${this.authUrl}/oauth/token`, body.toString(), headers )
      .pipe(tap(
        (res) => this.storage.setAppToken(res.access_token))
      );
  }

  // initAuthFlow() {
  //   const customer = this.storage.getCustomerToken();
  //   if (customer) {
  //     this.authState.set('customer');
  //     return;
  //   }

  //   const anon = this.storage.getAnonymousToken();
  //   if (anon) {
  //     this.authState.set('guest');
  //     return;
  //   }

  //   this.authState.set('loading');

  //   this.getAnonymousToken().subscribe(() => {
  //     this.authState.set('guest');
  //   });
  // }

  // getAppToken(): Observable<AppToken> {
  //   const body = new URLSearchParams();
  //   body.set('grant_type', 'client_credentials');
  //   body.set('client_id', this.client_id);
  //   body.set('client_secret', this.secret);
  //   body.set('scope', `manage_my_profile:${this.project_key}`);

  //   return this.http
  //     .post<AppToken>(`${this.authUrl}/oauth/token`, body.toString(), {
  //       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //     })
  //     .pipe(tap((res) => this.storage.setAppToken(res.access_token)));
  // }

  // getAnonymousToken(): Observable<Token> {
  //   const body = new URLSearchParams();
  //   body.set('grant_type', 'client_credentials');
  //   body.set('scope', 'anonymous_id');

  //   return this.http
  //     .post<Token>(`${this.authUrl}/oauth/${this.project_key}/anonymous/token`, body.toString(), {
  //       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //     })
  //     .pipe(
  //       tap((res) => {
  //         this.storage.setCustomerToken(res.access_token);
  //         this.storage.setRefreshToken(res.refresh_token);
  //       }),
  //     );
  // }

  login(email: string, password: string): Observable<Token> {
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('username', email);
    body.set('password', password);

    return this.http
      .post<Token>(`${this.authUrl}/oauth/${this.project_key}/customers/token`, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
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

    return this.http.post<SignupResponse>(`${this.url}/${this.project_key}me/signup`, data, {
      headers,
    });
  }

  getMe(): Observable<MeResponse> {
    const token = this.storage.getAppToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<MeResponse>(`${this.url}/${this.project_key}me`, {
      headers,
    });
  }

  refreshToken(): Observable<Token> | undefined {
    const refreshToken = this.storage.getRefreshToken();

    if (!refreshToken) {
      return; // to impove
    }

    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('refresh_token', refreshToken);
    body.set('client_id', this.client_id);
    body.set('client_secret', this.secret);

    return this.http
      .post<Token>(`${this.authUrl}/oauth/token`, body.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        tap((res) => {
          this.storage.setCustomerToken(res.access_token);

          this.authState.set('customer');
        }),
      );
  }

  // logout(): void {
  //   this.storage.clearTokens();
  //   this.authState.set('loading');

  //   this.getAnonymousToken().subscribe(() => {
  //     this.authState.set('guest');
  //   });
  // }
}
