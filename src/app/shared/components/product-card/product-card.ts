import { Component, inject, input } from '@angular/core';
import { Book } from '../../../types/book.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BooksService } from '../../../core/services//books-service/books-service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  book = input<Book>();
  private bookService = inject(BooksService);

  favoriteToggled(e: Event, id: string): void {
    e.stopPropagation();
    this.bookService.toggleFavorite(id);
  }

  cartToggled(e: Event, id: string): void {
    e.stopPropagation();
    this.bookService.toggleCart(id);
  }
}
