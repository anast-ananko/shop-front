import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Search } from './shared/components/search/search';
import { BooksService } from './core/books-service/books-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Search],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('shop-front');

  private bookService = inject(BooksService);
  protected readonly filteredBooks = this.bookService.filteredBooks;

}
