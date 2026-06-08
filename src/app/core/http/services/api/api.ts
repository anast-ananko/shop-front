import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private http = inject(HttpClient);

  post<T>(url: string, body: unknown, headers?: HttpHeaders) {
    return this.http.post<T>(url, body, { headers });
  }

  get<T>(url: string, headers?: HttpHeaders) {
    return this.http.get<T>(url, { headers });
  }
}
