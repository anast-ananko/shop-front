import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BooksService } from '../../core/services/books-service/books-service';
import { PaginatedBooksCatalog } from '../../shared/components/paginated-books-catalog/paginated-books-catalog';

@Component({
  selector: 'app-search',
  imports: [PaginatedBooksCatalog],
  templateUrl: './search.html',
  styleUrl: './search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Search {
  private readonly booksService = inject(BooksService);
  filteredBooks = this.booksService.filteredBooks;
}
