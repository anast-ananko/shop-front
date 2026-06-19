import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

import { environment } from '../../http/environment/environment';
import { Api } from '../../http/services/api/api';
import { ApiCategory, CategoryNode } from '../../../types/categories';
import { buildCategoryTree } from '../../../utils/build-category-tree';
import { TokenStorage } from '../../auth/services/token.storage';

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
    return this.apiService
      .get<ApiCategory>(`${this.url}/${this.project_key}/categories`)
      .pipe(
        map((res) => buildCategoryTree(res.results)),
        tap((categories) => this.categories.set(categories)),
      );
  }
}
