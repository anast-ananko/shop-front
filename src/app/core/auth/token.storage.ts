import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  private APP_KEY = 'app_token';
  private ANON_KEY = 'anon_token';
  private CUSTOMER_KEY = 'customer_token';
  private REF_KEY = 'refresh_token';

  setAppToken(token: string): void {
    localStorage.setItem(this.APP_KEY, token);
  }

  getAppToken(): string | null {
    return localStorage.getItem(this.APP_KEY);
  }

  setAnonymousToken(token: string): void {
    localStorage.setItem(this.ANON_KEY, token);
  }

  getAnonymousToken(): string | null {
    return localStorage.getItem(this.ANON_KEY);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.REF_KEY, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REF_KEY);
  }

  setCustomerToken(token: string): void {
    localStorage.setItem(this.CUSTOMER_KEY, token);
  }

  getCustomerToken(): string | null {
    return localStorage.getItem(this.CUSTOMER_KEY);
  }

  clearTokens(): void {
    localStorage.removeItem(this.CUSTOMER_KEY);
    localStorage.removeItem(this.REF_KEY);
    localStorage.removeItem(this.ANON_KEY);
  }
}
