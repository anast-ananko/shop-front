export interface ProductsResponse {
  results: Product[];
}

export interface Product {
  id: string;
  key: string;
  name: LocalizedString;
  description?: LocalizedString;
  masterVariant: Variant;
  attributes?: Attribute[];
}

export interface Variant {
  attributes?: Attribute[];
  images?: Image[];
  prices?: Price[];
}

export interface Attribute {
  name: BookAttributeName;
  value: string | number;
}

export interface Image {
  url: string;
}

export interface Price {
  value: {
    centAmount: number;
  };
}

export interface LocalizedString {
  'en-US': string;
}

export type BookAttributeName =
  | 'author'
  | 'publicationYear'
  | 'pages'
  | 'edition'
  | 'copiesLeft'
  | 'stockStatus'
  | 'rating'
  | 'category'
  | 'discountOffer'
  | 'reviews'
  | 'publisher';
