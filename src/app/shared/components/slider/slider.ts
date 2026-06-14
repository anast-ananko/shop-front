import { Component, CUSTOM_ELEMENTS_SCHEMA, input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Book } from '../../../types/book.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-slider',
  imports: [NgTemplateOutlet, MatIconModule, MatButtonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './slider.html',
  styleUrl: './slider.scss',
})
export class Slider {
  sliderBooks = input<Book[]>();
  cardTemplate = input<TemplateRef<unknown>>();

  breakpoints = {
    0: { slidesPerView: 1, spaceBetween: 16 },
    600: { slidesPerView: 2, spaceBetween: 16 },
    1250: { slidesPerView: 3, spaceBetween: 20 },
  };
}
