import { Component, input } from '@angular/core';
import { Book } from '../../../../types/book.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-slider-card',
  imports: [RouterLink],
  templateUrl: './slider-card.html',
  styleUrl: './slider-card.scss',
})
export class SliderCard {
  book = input<Book>();
}
