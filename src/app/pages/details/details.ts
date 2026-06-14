import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BooksService } from '../../core/services/books-service/books-service';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { MatIcon } from "@angular/material/icon";
import { Location } from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [MatButtonModule, CurrencyPipe, MatIcon],
  templateUrl: './details.html',
  styleUrl: './details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Details {
  private readonly bookService = inject(BooksService);
  private readonly route = inject(ActivatedRoute);
  private location = inject(Location);

  currentId = this.route.snapshot.paramMap.get('id') || '';
  readonly book = this.bookService.getBookById(this.currentId);

  goBack(): void {
    this.location.back();
  }
}
