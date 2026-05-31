import { inject, Injectable, signal } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../http/environment/environment';
import { MeResponse } from './models';
import { TokenStorage } from '../../auth/token.storage';
import { Api } from '../../http/services/api/api';
import { Customer } from '../../auth/models';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private url = environment.apiUrl;
  private project_key = environment.projectKey;

  private storage = inject(TokenStorage);
  private apiService = inject(Api);

  customer = signal<Customer | null>(null);

  getMe(): Observable<MeResponse> {
    const token = this.storage.getCustomerToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.apiService
      .get<MeResponse>(`${this.url}/${this.project_key}/me`, headers)
      .pipe(tap((customer) => this.customer.set(customer)));
  }

  updateMe(actions: unknown[]): Observable<MeResponse> {
    const token = this.storage.getCustomerToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const body = {
      version: this.customer()?.version ?? 1,
      actions,
    };

    return this.apiService
      .post<MeResponse>(`${this.url}/${this.project_key}/me`, body, headers)
      .pipe(
        tap((customer) => {
          this.customer.set(customer);
        }),
      );
  }

  changePassword(currentPassword: string, newPassword: string) {
    const token = this.storage.getCustomerToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const body = {
      version: this.customer()?.version ?? 1,
      currentPassword,
      newPassword,
    };

    return this.apiService
      .post<MeResponse>(`${this.url}/${this.project_key}/me/password`, body, headers)
      .pipe(
        tap((customer) => {
          this.customer.set(customer);
        }),
      );
  }
}
