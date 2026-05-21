import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './core/header/header';
import { Footer } from './core/footer/footer';
import { BooksService } from './core/books-service/books-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('shop-front');
  private booksService = inject(BooksService);

  isAuth = signal(false);
  cartCount = signal(3);

  ngOnInit() {
  this.booksService.getBooks().subscribe();
}

  handleLogout() {
    this.isAuth.set(false);
  }
}
