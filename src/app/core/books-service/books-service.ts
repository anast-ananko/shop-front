import { computed, Injectable, signal } from '@angular/core';
import { Book } from '../../types/book.interface';
import { getBooks } from '../../mock-data/db.books';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  readonly books = signal<Book[]>(getBooks());
  public searchValue = signal<string>('');

  readonly favoriteBooks = computed(() => this.books().filter((book) => book.isFavorite));

  readonly filteredBooks = computed(() => {
    const value = this.searchValue().trim().toLocaleLowerCase();

    return this.books().filter((book) => {
      return book.title.toLowerCase().includes(value);
    });
  });

  getBookById(id: number): Book | undefined {
    return this.books().find((book) => book.id === id);
  }

  toggleFavorite(id: number): void {
    this.books.update((books) =>
      books.map((book) => (book.id === id ? { ...book, isFavorite: !book.isFavorite } : book)),
    );
  }
  
  toggleCart(id: number): void {
    this.books.update((books) =>
      books.map((book) => (book.id === id ? { ...book, isInCart: !book.isInCart } : book)),
    );
  }


  updateSearchValue(value: string): void {
    this.searchValue.update((v) => v + value);
  }

  setSearchValue(value: string): void {
    this.searchValue.set(value);
  }
}
