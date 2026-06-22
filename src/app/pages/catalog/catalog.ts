import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { PaginatedBooksCatalog } from '../../shared/components/paginated-books-catalog/paginated-books-catalog';
import { BooksService } from '../../core/services/books-service/books-service';
import { CategoryBar } from '../../shared/components/category-bar/category-bar';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { SortOption } from '../../types/book.interface';

@Component({
  selector: 'app-catalog',
  imports: [PaginatedBooksCatalog, CategoryBar, MatSelectModule, MatFormFieldModule],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Catalog implements OnInit {
  private booksService = inject(BooksService);
  private categoriesService = inject(CategoriesService);

  sortedBooks = computed(() => {
    const books = this.booksService.filteredFromApi();

    switch (this.sortBy()) {
      case 'priceAsc':
        return [...books].sort((a, b) => a.price - b.price);

      case 'priceDesc':
        return [...books].sort((a, b) => b.price - a.price);

      case 'nameAsc':
        return [...books].sort((a, b) => a.title.localeCompare(b.title));

      case 'nameDesc':
        return [...books].sort((a, b) => b.title.localeCompare(a.title));

      default:
        return books;
    }
  });

  loadingBooks = signal(false);
  errorBooks = signal<string | null>(null);

  pageSize = signal<number>(8);

  sortBy = signal<SortOption>('nameAsc');

  ngOnInit() {
    this.loadCategories();
    this.loadBooks();
  }

  private loadCategories(): void {
    this.errorBooks.set(null);

    this.categoriesService.getCategories().subscribe();
  }

  private loadBooks(categoryId?: string): void {
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

  setSort(value: SortOption): void {
    this.sortBy.set(value);
  }
}
