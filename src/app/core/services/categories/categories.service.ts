import { inject, Injectable, signal } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';

import { environment } from '../../http/environment/environment';
import { Api } from '../../http/services/api/api';
import { TokenStorage } from '../../auth/token.storage';
import { ApiCategory, CategoryNode } from '../../../types/categories';
import { buildCategoryTree } from '../../../utils/build-category-tree';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private url = environment.apiUrl;
  private project_key = environment.projectKey;

  private apiService = inject(Api);
  private storage = inject(TokenStorage);

  categories = signal<CategoryNode[]>([]);

  getCategories(): Observable<CategoryNode[]> {
    const token = this.storage.getCustomerToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.apiService
      .get<ApiCategory>(`${this.url}/${this.project_key}/categories`, headers)
      .pipe(
        map((res) => buildCategoryTree(res.results)),
        tap((categories) => this.categories.set(categories)),
      );
  }
}
