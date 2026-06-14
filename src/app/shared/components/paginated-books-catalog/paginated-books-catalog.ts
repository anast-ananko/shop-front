import { Component, computed, input, signal } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ProductCard } from '../product-card/product-card';
import { Book } from '../../../types/book.interface';

@Component({
  selector: 'app-paginated-books-catalog',
  imports: [MatPaginatorModule, ProductCard],
  templateUrl: './paginated-books-catalog.html',
  styleUrl: './paginated-books-catalog.scss',
})
export class PaginatedBooksCatalog {
  filteredBooks = input<Book[]>([]);
  title = input<string>("");
  emptyMessage = input<string>("");

  pageIndex = signal(0);
  pageSizeOptions = [4, 8, 12, 16];
  pageSize = signal(4);

  paginatedBooks = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();

    return this.filteredBooks().slice(start, end);
  });

  handlePageEvent(e: PageEvent) {
    this.pageSize.set(e.pageSize);
    this.pageIndex.set(e.pageIndex);
  }
}
