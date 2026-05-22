import { computed, inject, Injectable, signal } from '@angular/core';
import { Book } from '../../types/book.interface';
import { TokenStorage } from '../http/services/auth/token.storage';
import { HttpHeaders } from '@angular/common/http';
import { Api } from '../http/services/api/api';
import { environment } from '../http/environment/environment';
import { map, Observable, switchMap, tap } from 'rxjs';
import { Product, ProductsResponse } from '../../types/api.response';
import { AuthService } from '../http/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private storage = inject(TokenStorage);
  private apiService = inject(Api);
  private authService = inject(AuthService);

  readonly books = signal<Book[]>([]);
  public searchValue = signal<string>('');

  private url = environment.apiUrl;
  private project_key = environment.projectKey;
  private readonly limit = 100;

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

  getBooks(): Observable<Book[]> {
    const token = this.storage.getAppToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.apiService
      .get<ProductsResponse>(
        `${this.url}/${this.project_key}/product-projections?limit=${this.limit}`,
        headers,
      )
      .pipe(
        map((response) => response.results.map((product) => this.mapProductToBook(product))),
        tap((books) => this.books.set(books)),
      );
  }

  // getBooks(): Observable<Book[]> {
  //   const token = this.storage.getAppToken();

  //   if (token) return this.getBooksRequest(token);

  //   return this.authService
  //     .getAccessToken()
  //     .pipe(switchMap((res) => this.getBooksRequest(res.access_token)));
  // }

  // private getBooksRequest(token: string) {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //   });

  //   return this.apiService
  //     .get<ProductsResponse>(
  //       `${this.url}/${this.project_key}/product-projections?limit=${this.limit}`,
  //       headers,
  //     )
  //     .pipe(
  //       map((response) => response.results.map((product) => this.mapProductToBook(product))),
  //       tap((books) => this.books.set(books)),
  //     );
  // }

  private mapProductToBook(product: Product): Book {
    const attributes = product.attributes ?? [];
    const getAttribute = (name: string) =>
      attributes.find((attribute) => attribute.name === name)?.value;

    return {
      id: product.id,
      key: product.key,
      title: product.name['en-US'] ?? '',
      description: product.description?.['en-US'] ?? '',
      imageUrl: product.masterVariant.images?.[0]?.url ?? '',
      price: product.masterVariant.prices?.[0]?.value.centAmount ?? 0,
      author: String(getAttribute('author') ?? ''),
      publicationYear: Number(getAttribute('publicationYear') ?? 0),
      pages: Number(getAttribute('pages') ?? 0),
      edition: String(getAttribute('edition') ?? ''),
      copiesLeft: Number(getAttribute('copiesLeft') ?? 0),
      stockStatus: String(getAttribute('stockStatus') ?? ''),
      rating: Number(getAttribute('rating') ?? 0),
      category: String(getAttribute('category') ?? ''),
      reviews: Number(getAttribute('reviews') ?? 0),
      publisher: String(getAttribute('publisher') ?? ''),
      isFavorite: false,
      isInCart: false,
    };
  }
}
