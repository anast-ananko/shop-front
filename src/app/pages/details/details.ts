import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BooksService } from '../../core/books-service/books-service';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [MatButtonModule, RouterLink, CurrencyPipe],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details {
  private readonly bookService = inject(BooksService);
  private readonly route = inject(ActivatedRoute);

  currentId = this.route.snapshot.paramMap.get('id') || '';
  readonly book = this.bookService.getBookById(this.currentId);
}
