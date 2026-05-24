import { Component, input } from '@angular/core';
import { Book } from '../../../../types/book.interface';

@Component({
  selector: 'app-slider-card',
  imports: [],
  templateUrl: './slider-card.html',
  styleUrl: './slider-card.scss',
})
export class SliderCard {
  book = input<Book>();
}
