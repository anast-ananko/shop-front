import { Component, inject } from '@angular/core';
import { Slider } from '../../shared/components/slider/slider';
import { BooksService } from '../../core/books-service/books-service';
import { Popular } from './popular/popular';
import { SliderCard } from '../../shared/components/slider/slider-card/slider-card';
import { Latest } from './latest/latest';

@Component({
  selector: 'app-home',
  imports: [Slider, Popular, SliderCard, Latest],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private bookService = inject(BooksService);
  protected readonly filteredBooks = this.bookService.filteredBooks;
}
