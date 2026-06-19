import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { PaginatedBooksCatalog } from '../../shared/components/paginated-books-catalog/paginated-books-catalog';
import { BooksService } from '../../core/services/books-service/books-service';
import { CategoryBar } from '../../shared/components/category-bar/category-bar';
import { CategoriesService } from '../../core/services/categories/categories.service';

@Component({
  selector: 'app-catalog',
  imports: [PaginatedBooksCatalog, CategoryBar],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Catalog {
  private booksService = inject(BooksService);
  private categoriesService = inject(CategoriesService);

  books = this.booksService.filteredFromApi;

  loadingBooks = signal(false);
  errorBooks = signal<string | null>(null);

  pageSize = signal<number>(8);

  ngOnInit() {
    this.loadCategories();
    this.loadBooks();
  }

  private loadCategories() {
    this.errorBooks.set(null);

    this.categoriesService.getCategories().subscribe();
  }

  private loadBooks(categoryId?: string) {
    this.loadingBooks.set(true);
    this.errorBooks.set(null);

    this.booksService.getBooksWithFilters({ categoryId }).subscribe({
      next: () => {
        this.loadingBooks.set(false);
      },
      error: () => {
        this.errorBooks.set('Failed to load books');
        this.loadingBooks.set(false);
      },
    });
  }
}
