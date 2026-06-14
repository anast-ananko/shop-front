import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { BooksService } from '../../../../core/services/books-service/books-service';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { Slider } from '../../../../shared/components/slider/slider';

@Component({
  selector: 'app-popular',
  imports: [ProductCard, Slider],
  templateUrl: './popular.html',
  styleUrl: './popular.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Popular {
  private readonly bookService = inject(BooksService);
  readonly popularBooks = this.bookService.popularBooks;

}
