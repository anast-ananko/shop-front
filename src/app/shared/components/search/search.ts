import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BooksService } from '../../../core/books-service/books-service';

@Component({
  selector: 'app-search',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  private bookService = inject(BooksService);
  searchValue = this.bookService.searchValue;

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.bookService.setSearchValue(input.value);
  }

  removeSearch(): void {
    this.bookService.setSearchValue('');
  }

}
