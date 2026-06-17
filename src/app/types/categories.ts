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
    'de-DE': string;
  };
  slug: {
    'de-DE': string;
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

export interface CategoriesState {
  data: CategoryNode[];
  loading: boolean;
  error: string | null;
}
