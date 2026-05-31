import { Component, inject } from '@angular/core';
import { CardCart } from './components/card-cart/card-cart';

import { BooksService } from '../../core/services/books-service/books-service';

@Component({
  selector: 'app-cart',
  imports: [CardCart],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  private bookService = inject(BooksService);
  protected readonly books = this.bookService.filteredBooks;

}
