import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  private APP_KEY = 'app_token';
  private ANON_KEY = 'anon_token';
  private CUSTOMER_KEY = 'customer_token';
  private REF_KEY = 'refresh_token';

  getCurrentToken() {
    return this.getCurrentCustomerToken() ??
      this.getCurrentAnonymousToken();
  }

  setCurrentAppToken(token: string): void {
    localStorage.setItem(this.APP_KEY, token);
  }

  getCurrentAppToken(): string | null {
    return localStorage.getItem(this.APP_KEY);
  }

  setCurrentAnonymousToken(token: string): void {
    localStorage.setItem(this.ANON_KEY, token);
  }

  getCurrentAnonymousToken(): string | null {
    return localStorage.getItem(this.ANON_KEY);
  }

  deleteCurrentAnonymousToken(): void {
    return localStorage.removeItem(this.ANON_KEY);
  }

  setCurrentRefreshToken(token: string): void {
    localStorage.setItem(this.REF_KEY, token);
  }

  getCurrentRefreshToken(): string | null {
    return localStorage.getItem(this.REF_KEY);
  }

  setCurrentCustomerToken(token: string): void {
    localStorage.setItem(this.CUSTOMER_KEY, token);
  }

  getCurrentCustomerToken(): string | null {
    return localStorage.getItem(this.CUSTOMER_KEY);
  }

  clearTokens(): void {
    localStorage.removeItem(this.CUSTOMER_KEY);
    localStorage.removeItem(this.REF_KEY);
    localStorage.removeItem(this.ANON_KEY);
  }
}
