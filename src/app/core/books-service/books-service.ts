import { computed, inject, Injectable, signal } from '@angular/core';
import { Book } from '../../types/book.interface';
import { TokenStorage } from '../http/services/auth/token.storage';
import { HttpHeaders } from '@angular/common/http';
import { Api } from '../http/services/api/api';
import { environment } from '../http/environment/environment';
import { map, tap } from 'rxjs';
// import { getBooks } from '../../mock-data/db.books';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private storage = inject(TokenStorage);
  private apiService = inject(Api);

  readonly books = signal<Book[]>([]);
  public searchValue = signal<string>('');

  private url = environment.apiUrl;
  private project_key = environment.projectKey;

  readonly favoriteBooks = computed(() => this.books().filter((book) => book.isFavorite));

  readonly filteredBooks = computed(() => {
    const value = this.searchValue().trim().toLocaleLowerCase();

    return this.books().filter((book) => {
      return book.title.toLowerCase().includes(value);
    });
  });
  getBookById(id: string): Book | undefined {
    return this.books().find((book) => book.id === id);
  }

  toggleFavorite(id: string): void {
    this.books.update((books) =>
      books.map((book) => (book.id === id ? { ...book, isFavorite: !book.isFavorite } : book)),
    );
  }

  toggleCart(id: string): void {
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

  getBooks() {
    const token = this.storage.getAppToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.apiService
      .get(`${this.url}/${this.project_key}/product-projections?limit=100`, headers)
      .pipe(
        map((response: any) =>
          response.results.map((product: any) => this.mapProductToBook(product)),
        ),
        tap((books) => this.books.set(books)),
      );
  }

  private mapProductToBook(product: any): Book {
    const getAttribute = (name: string) =>
      product.masterVariant.attributes.find((attribute: any) => attribute.name === name)?.value;

    return {
      id: product.id,
      key: product.key,
      title: product.name['en-US'],
      description: product.description?.['en-US'] ?? '',
      imageUrl: product.masterVariant.images?.[0]?.url ?? '',
      price: product.masterVariant.prices?.[0]?.value?.centAmount ?? 0,
      author: getAttribute('author'),
      publicationYear: getAttribute('publicationYear'),
      pages: getAttribute('pages'),
      edition: getAttribute('edition'),
      copiesLeft: getAttribute('copiesLeft'),
      stockStatus: getAttribute('stockStatus'),
      rating: getAttribute('rating'),
      category: getAttribute('category'),
      reviews: getAttribute('reviews'),
      publisher: getAttribute('publisher'),
      isFavorite: false,
      isInCart: false,
    };
  }
}
