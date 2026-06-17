import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';

import { environment } from '../../http/environment/environment';
import { Api } from '../../http/services/api/api';
import { TokenStorage } from '../../auth/token.storage';
import { ApiCategory, CategoriesState } from '../../../types/categories';
import { buildCategoryTree } from '../../../utils/build-category-tree';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private url = environment.apiUrl;
  private project_key = environment.projectKey;

  private apiService = inject(Api);
  private storage = inject(TokenStorage);

  private state = signal<CategoriesState>({
    data: [],
    loading: false,
    error: null,
  });

  categories = computed(() => this.state().data);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  getCategories() {
    this.state.update((s) => ({ ...s, loading: true, error: null }));

    const token = this.storage.getCustomerToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    this.apiService
      .get<ApiCategory>(`${this.url}/${this.project_key}/categories`, headers)
      .pipe(map((res) => buildCategoryTree(res.results)))
      .subscribe({
        next: (data) => {
          this.state.set({
            data,
            loading: false,
            error: null,
          });
        },
        error: () => {
          this.state.set({
            data: [],
            loading: false,
            error: 'Failed to load categories',
          });
        },
      });
  }
}
