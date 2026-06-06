import { Component, computed, inject, signal } from '@angular/core';
import { BooksService } from '../../core/services/books-service/books-service';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-search',
  imports: [ProductCard, MatPaginatorModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  private bookService = inject(BooksService);
  initialListOfBooks = this.bookService.filteredBooks;

  pageIndex = signal(0);
  pageSizeOptions = [4, 8, 12, 16];
  pageSize = signal(4);


  paginatedBooks = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();

    return this.initialListOfBooks().slice(start, end);
  });

  handlePageEvent(e: PageEvent) {
    this.pageSize.set(e.pageSize);
    this.pageIndex.set(e.pageIndex);
  }
}
