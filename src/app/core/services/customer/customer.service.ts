import { inject, Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../http/environment/environment';
import { MeResponse } from './models';
import { TokenStorage } from '../../auth/token.storage';
import { Api } from '../../http/services/api/api';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private url = environment.apiUrl;
  private project_key = environment.projectKey;

  private storage = inject(TokenStorage);
  private apiService = inject(Api);

  getMe(): Observable<MeResponse> {
    const token = this.storage.getCustomerToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.apiService.get<MeResponse>(`${this.url}/${this.project_key}/me`, headers);
  }

  updateMe(actions: unknown[], version: number): Observable<MeResponse> {
    const token = this.storage.getCustomerToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const body = {
      version,
      actions,
    };

    return this.apiService.post<MeResponse>(`${this.url}/${this.project_key}/me`, body, headers);
  }
}
