import { Component, inject, input } from '@angular/core';
import { Book } from '../../../types/book.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BooksService } from '../../../core/books-service/books-service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  book = input<Book>();
  private bookService = inject(BooksService);

  favoriteToggled(id: number): void {
    this.bookService.toggleFavorite(id);
  }
  cartToggled(id: number): void {
    this.bookService.toggleCart(id);
  }
}
