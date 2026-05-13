import { computed, Injectable, signal } from '@angular/core';
import { Book } from '../../types/book.interface';
import { getBooks } from '../../mock-data/db.books';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
    readonly books = signal<Book[]>(getBooks());

  readonly favoriteBooks = computed(() =>
    this.books().filter((book) => book.isFavorite)

  );

  getBookById(id: number): Book | undefined {
    return this.books().find((book) => book.id === id);
  }

  toggleFavorite(id: number): void {
    this.books.update((books) =>
      books.map((book) => book.id === id ? { ...book, isFavorite: !book.isFavorite } : book)
    );
  }


}
