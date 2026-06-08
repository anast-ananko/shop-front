import { Component, computed, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { CardCart } from './components/card-cart/card-cart';

import { BooksService } from '../../core/services/books-service/books-service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CardCart, RouterLink, MatIconModule, MatFormFieldModule, MatButtonModule, DecimalPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  private bookService = inject(BooksService);
  protected readonly books = this.bookService.filteredBooks;
  cardTotals = signal<Record<string, number>>({});

  @ViewChildren(CardCart) cardCartComponents?: QueryList<CardCart>;

  protected readonly booksInCart = computed(() => {
    return this.books().filter((book) => book.isInCart);
  });

  cardTotalsChanged(value: { id: string; total: number }): void {
    this.cardTotals.update((totals) => ({
      ...totals,
      [value.id]: value.total,
    }));
  }

  protected readonly totalPrice = computed(() => {
    return Object.values(this.cardTotals()).reduce((sum, total) => sum + total, 0);
  });

  removeCart(): void{
    this.cardCartComponents?.forEach((cardCart) => {
      cardCart.cartToggled(new Event('click'), cardCart.book()?.id || '');
    });
  }
}
