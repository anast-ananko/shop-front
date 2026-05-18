import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BooksService } from './core/books-service/books-service';
import { ProductCard } from './shared/components/product-card/product-card';
import { Slider } from './shared/components/slider/slider';
import { Header } from './core/header/header';
import { Footer } from './core/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductCard, Slider, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('shop-front');

  private bookService = inject(BooksService);
  protected readonly filteredBooks = this.bookService.filteredBooks;

  isAuth = signal(false);
  cartCount = signal(3);

  handleLogout() {
    this.isAuth.set(false);
  }
}
