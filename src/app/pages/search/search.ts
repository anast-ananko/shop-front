import { Component, inject } from '@angular/core';
import { BooksService } from '../../core/services/books-service/books-service';
import { ProductCard } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-search',
  imports: [ProductCard],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  private bookService = inject(BooksService);
  books = this.bookService.filteredBooks;
}
