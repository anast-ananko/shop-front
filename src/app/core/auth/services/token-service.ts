import { HttpHeaders, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AppToken, Token } from '../models';
import { Api } from '../../http/services/api/api';
import { environment } from '../../http/environment/environment';
import { TokenStorage } from './token.storage';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private apiService = inject(Api);
  private authUrl = environment.authUrl;
  private project_key = environment.projectKey;
  private client_id = environment.clientId;
  private secret = environment.clientSecret;
  private scope = environment.scope;
  private storage = inject(TokenStorage);

  customerToken = signal<string | null>(this.storage.getCurrentCustomerToken());

  isAuth = computed(() => this.customerToken() !== null);
  isGuest = computed(() => this.customerToken() === null);

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

  // --------------- get tokens ---------------

  getAccessToken(): Observable<AppToken> {
    return this.apiService
      .post<AppToken>(
        `${this.authUrl}/oauth/token`,
        this.getClientCredentialsBody(),
        this.getBasicHeaders(),
      )
      .pipe(
        tap((res) => {
          this.storage.setCurrentAppToken(res.access_token);
        }),
      );
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
          this.customerToken.set(null);
          this.storage.setCurrentAnonymousToken(res.access_token);
          this.storage.setCurrentRefreshToken(res.refresh_token);
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
          this.customerToken.set(res.access_token);
          this.storage.setCurrentCustomerToken(res.access_token);
          this.storage.setCurrentRefreshToken(res.refresh_token);
          this.storage.deleteCurrentAnonymousToken();
        }),
      );
  }
}
