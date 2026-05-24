import { Component, CUSTOM_ELEMENTS_SCHEMA, input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Book } from '../../../types/book.interface';

@Component({
  selector: 'app-slider',
  imports: [NgTemplateOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './slider.html',
  styleUrl: './slider.scss',
})
export class Slider {
  sliderBooks = input<Book[]>();
  cardTemplate = input<TemplateRef<unknown>>();
}
