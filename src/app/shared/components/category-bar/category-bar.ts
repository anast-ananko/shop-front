import { Component, computed, inject, signal } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { CategoriesService } from '../../../core/services/categories/categories.service';
import { CategoryNode } from '../../../types/categories';

@Component({
  selector: 'app-category-bar',
  imports: [MatMenuModule, MatButtonModule],
  templateUrl: './category-bar.html',
  styleUrl: './category-bar.scss',
})
export class CategoryBar {
  private categoriesService = inject(CategoriesService);

  active = signal<CategoryNode | null>(null);
  selected = signal<CategoryNode | null>(null);
  categories = computed(() => [
    {
      id: 'all',
      name: 'All',
      children: [],
    },
    ...this.categoriesService.categories(),
  ]);

  ngOnInit() {
    this.categoriesService.getCategories();
    console.log(this.categoriesService.categories());
  }

  setActiveCategory(category: CategoryNode): void {
    if (category.id === 'all') {
      this.selected.set(null);
      this.active.set(null);
      return;
    }

    this.active.set(category);
  }

  selectCategory(category: CategoryNode): void {
    this.selected.set(category);
    console.log(this.selected());
  }

  title = computed(() => {
    const selected = this.selected();

    if (!selected) return 'All Books';

    return `${selected.name} Books`;
  });
}
