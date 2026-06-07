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
  // swiperBreakpoints = {
  //   320: {
  //     slidesPerView: 1,
  //     spaceBetween: 10,
  //   },
  //   600: {
  //     slidesPerView: 2,
  //     spaceBetween: 12,
  //   },
  //   900: {
  //     slidesPerView: 3,
  //     spaceBetween: 15,
  //   },

  //   1200: {
  //     slidesPerView: 4,
  //     spaceBetween: 15,
  //   },
  // };
}
