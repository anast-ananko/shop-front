export interface ApiCategory {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: Category[];
}

export interface Category {
  id: string;
  name: {
    'en-US': string;
  };
  slug: {
    'en-US': string;
  };
  ancestors: {
    id: string;
  }[];
}

export interface CategoryNode {
  id: string;
  name: string;
  children: CategoryNode[];
}

export interface BooksFilters {
  categoryId?: string | null;
}
