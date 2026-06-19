import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { CategoriesService } from '../../../core/services/categories/categories.service';
import { CategoryNode } from '../../../types/categories';
import { BooksService } from '../../../core/services/books-service/books-service';
import { Book } from '../../../types/book.interface';

const ALL_CATEGORY: CategoryNode = {
  id: 'all',
  name: 'All',
  children: [],
};

@Component({
  selector: 'app-category-bar',
  imports: [MatMenuModule, MatButtonModule],
  templateUrl: './category-bar.html',
  styleUrl: './category-bar.scss',
})
export class CategoryBar {
  private categoriesService = inject(CategoriesService);
  private booksService = inject(BooksService);

  books = signal<Book[]>([]);

  selectedCategory = signal<CategoryNode | null>(null);
  selectedSubcategory = signal<CategoryNode | null>(null);
  categories = computed(() => [ALL_CATEGORY, ...this.categoriesService.categories()]);

  constructor() {
    effect(() => {
      const subcategory = this.selectedSubcategory();

      if (!subcategory) {
        this.booksService.getBooksWithFilters().subscribe();
        return;
      } else {
        this.booksService
          .getBooksWithFilters({
            categoryId: subcategory.id,
          })
          .subscribe();
        return;
      }
    });
  }

  setActiveCategory(category: CategoryNode): void {
    if (category.id === 'all') {
      this.selectedCategory.set(ALL_CATEGORY);
      this.selectedSubcategory.set(null);
      return;
    }

    this.selectedCategory.set(category);
  }

  setActiveSubcategory(category: CategoryNode): void {
    this.selectedSubcategory.set(category);
  }

  title = computed(() => {
    const selected = this.selectedSubcategory();

    if (!selected) return 'All Books';

    return `${selected.name} Books`;
  });
}
