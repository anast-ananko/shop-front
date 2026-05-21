import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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

  private readonly destroyRef = inject(DestroyRef);

  isAuth = signal(false);
  cartCount = signal(3);

  ngOnInit() {
    this.booksService.getBooks()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err) => console.error('Error fetching books', err),
      });
  }

  handleLogout() {
    this.isAuth.set(false);
  }
}
