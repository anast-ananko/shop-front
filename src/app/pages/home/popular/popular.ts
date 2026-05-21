import { Component, OnInit, inject } from '@angular/core';
import { BooksService } from '../../../core/books-service/books-service';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { Slider } from '../../../shared/components/slider/slider';

@Component({
  selector: 'app-popular',
  imports: [ProductCard, Slider],
  templateUrl: './popular.html',
  styleUrl: './popular.scss',
})
export class Popular implements OnInit {
  private readonly bookService = inject(BooksService);

  readonly popularBooks = this.bookService.popularBooks;

  ngOnInit(): void {
    console.log(this.popularBooks());
  }
}
