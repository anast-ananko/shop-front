import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BooksService } from '../../../../../core/services/books-service/books-service';
import { PaginatedBooksCatalog } from '../../../../../shared/components/paginated-books-catalog/paginated-books-catalog';

@Component({
  selector: 'app-favorites',
  imports: [PaginatedBooksCatalog],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Favorites {
  private readonly booksService = inject(BooksService);
  favoriteBooks = this.booksService.favoriteBooks;
}
