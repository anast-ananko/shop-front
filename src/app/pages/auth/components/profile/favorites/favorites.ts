import { Component, computed, inject, signal } from '@angular/core';
import { BooksService } from '../../../../../core/services/books-service/books-service';
import { ProductCard } from '../../../../../shared/components/product-card/product-card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-favorites',
  imports: [ProductCard, MatPaginatorModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites {
  private readonly booksService = inject(BooksService);
  favoriteBooks = this.booksService.favoriteBooks;

  pageIndex = signal(0);
  pageSizeOptions = [4, 8, 12, 16];
  pageSize = signal(4);

  paginatedBooks = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();

    return this.favoriteBooks().slice(start, end);
  });

  handlePageEvent(e: PageEvent) {
    this.pageSize.set(e.pageSize);
    this.pageIndex.set(e.pageIndex);
  }
}
