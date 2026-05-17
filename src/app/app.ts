import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Search } from './shared/components/search/search';
import { BooksService } from './core/books-service/books-service';
import { ProductCard } from './shared/components/product-card/product-card';
import { Slider } from './shared/components/slider/slider';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Search, ProductCard, Slider],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('shop-front');

  private bookService = inject(BooksService);
  protected readonly filteredBooks = this.bookService.filteredBooks;
}
