import { Component, inject } from '@angular/core';
import { Slider } from '../../shared/components/slider/slider';
import { BooksService } from '../../core/books-service/books-service';
import { ProductCard } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-home',
  imports: [ProductCard, Slider],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private bookService = inject(BooksService);
  constructor() {
    this.bookService.getBooks().subscribe();
  }
  protected readonly filteredBooks = this.bookService.filteredBooks;
}
