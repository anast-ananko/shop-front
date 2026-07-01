import { computed, inject, Injectable, signal } from '@angular/core';
import { forkJoin, map, Observable, tap } from 'rxjs';

import { Book } from '../../../types/book.interface';
import { TokenStorage } from '../../auth/services/token.storage';
import { Api } from '../../http/services/api/api';
import { environment } from '../../http/environment/environment';
import { Product, ProductsResponse } from '../../../types/api.response';
import { BooksFilters } from '../../../types/categories';
import { Cart } from '../../../types/cart.interface';
import { CartService } from '../cart-service/cart-service';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  // private storage = inject(TokenStorage);
  private apiService = inject(Api);
  private cartService = inject(CartService);

  readonly books = signal<Book[]>([]);
  readonly cart = signal<Cart | null>(null);
  readonly filteredFromApi = signal<Book[]>([]);
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

  readonly latestBooks = computed(() => {
    // current realisation is based on our Book model => year property
    // with API request would be changed to
    // return this.books().map((el) => ({...el, year: new Date(el.year)})).sort((a, b) => (b.year.getTime() - a.year.getTime()));

    return [...this.books()].sort((a, b) => b.publicationYear - a.publicationYear);
  });

  readonly popularBooks = computed(() => {
    // I guess here would be similar to realisation just need to be installed
    // what would be the treshold of our rating propert
    return [...this.books()].sort((a, b) => b.rating - a.rating);
  });

  readonly booksInCart = computed(() => {
    return this.books().filter((book) => book.isInCart);
  });

  getBookById(id: string): Book | undefined {
    return this.books().find((book) => book.id === id);
  }

  toggleFavorite(id: string): void {
    this.books.update((books) =>
      books.map((book) => (book.id === id ? { ...book, isFavorite: !book.isFavorite } : book)),
    );
  }

  isBookInCart(id: string): boolean {
    return this.books().some((book) => book.id === id && book.isInCart);
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
    return this.apiService
      .get<ProductsResponse>(
        `${this.url}/${this.project_key}/product-projections?limit=${this.limit}`,
      )
      .pipe(
        map((response) => response.results.map((product) => this.mapProductToBook(product))),
        tap((books) => this.books.set(books)),
      );
  }

  getBooksWithFilters(filters: BooksFilters = {}): Observable<Book[]> {
    let url = `${this.url}/${this.project_key}/product-projections?limit=${this.limit}`;

    if (filters.categoryId) {
      url += `&where=categories(id="${filters.categoryId}")`;
    }

    return this.apiService.get<ProductsResponse>(url).pipe(
      map((res) => res.results.map((p) => this.mapProductToBook(p))),
      tap((books) => this.filteredFromApi.set(books)),
    );
  }

  private mapProductToBook(product: Product): Book {
    const attributes = product.attributes ?? [];
    const getAttribute = (name: string) =>
      attributes.find((attribute) => attribute.name === name)?.value;

    const price = product.masterVariant.prices?.[0]?.value.centAmount ?? 0;

    return {
      id: product.id,
      key: product.key,
      title: product.name['en-US'] ?? '',
      description: product.description?.['en-US'] ?? '',
      imageUrl: product.masterVariant.images?.[0]?.url ?? '',
      price: price / 100,
      author: String(getAttribute('author') ?? ''),
      publicationYear: Number(getAttribute('publicationYear') ?? 0),
      pages: Number(getAttribute('pages') ?? 0),
      edition: String(getAttribute('edition') ?? ''),
      copiesLeft: Number(getAttribute('copiesLeft') ?? 0),
      stockStatus: String(getAttribute('stockStatus') ?? ''),
      rating: Number(getAttribute('rating') ?? 0),
      category: String(getAttribute('category') ?? ''),
      subcategory: String(getAttribute('subcategory') ?? ''),
      reviews: Number(getAttribute('reviews') ?? 0),
      publisher: String(getAttribute('publisher') ?? ''),
      isFavorite: false,
      isInCart: false,
    };
  }

  initStore() {
    return forkJoin([
      this.getBooks(),
      this.cartService.initCart()
    ]);
  }
}
