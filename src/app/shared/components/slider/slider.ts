import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { BooksService } from '../../../core/books-service/books-service';
import { SliderCard } from './slider-card/slider-card';

@Component({
  selector: 'app-slider',
  imports: [SliderCard],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './slider.html',
  styleUrl: './slider.scss',
})
export class Slider {
  private bookService = inject(BooksService);

  books = this.bookService.books;
}
