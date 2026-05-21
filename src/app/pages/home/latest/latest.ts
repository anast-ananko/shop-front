import { Component, inject } from '@angular/core';
import { BooksService } from '../../../core/books-service/books-service';
import { Slider } from '../../../shared/components/slider/slider';
import { ProductCard } from '../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-latest',
  imports: [Slider, ProductCard],
  templateUrl: './latest.html',
  styleUrl: './latest.scss',
})
export class Latest {
  private readonly bookService = inject(BooksService);

  readonly latestBooks = this.bookService.latestBooks;
}
