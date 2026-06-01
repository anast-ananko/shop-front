import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { BooksService } from '../../../../core/services/books-service/books-service';
import { Book } from '../../../../types/book.interface';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-card-cart',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatButtonToggleModule, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card-cart.html',
  styleUrl: './card-cart.scss',
})
export class CardCart implements OnInit {
  private bookService = inject(BooksService);

  book = input<Book>();
  counter = 1;
  totalSum = output<{ id: string; total: number }>();

  ngOnInit(): void {
    this.emitCounterValue();
  }

  emitCounterValue(): void {
    const book = this.book();

    if (book?.price) {
      const value = book.price * this.counter;
      this.totalSum.emit({ id: book.id, total: value});
    }
  }

  cartToggled(e: Event, id: string): void {
    e.stopPropagation();
    this.counter = 0;
    this.emitCounterValue();
    this.bookService.toggleCart(id);
  }
}
