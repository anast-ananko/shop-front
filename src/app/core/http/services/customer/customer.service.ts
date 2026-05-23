import { inject, Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { environment } from '../../environment/environment';
import { TokenStorage } from '../auth/token.storage';
import { Api } from '../api/api';
import { Observable } from 'rxjs';
import { MeResponse } from '../auth/models';

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

    return this.apiService.get<MeResponse>(`${this.url}/${this.project_key}me`, headers);
  }
}
