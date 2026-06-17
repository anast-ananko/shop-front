import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { PaginatedBooksCatalog } from '../../shared/components/paginated-books-catalog/paginated-books-catalog';
import { BooksService } from '../../core/services/books-service/books-service';
import { CategoryBar } from "../../shared/components/category-bar/category-bar";

@Component({
  selector: 'app-catalog',
  imports: [PaginatedBooksCatalog, CategoryBar],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Catalog {
  private readonly booksService = inject(BooksService);
  filteredBooks = this.booksService.filteredBooks;
  pageSize = signal<number>(8);
}
