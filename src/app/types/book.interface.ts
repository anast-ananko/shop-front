export interface Book {
  // id: number;
  // title: string;
  // year: number;
  // genre: string;
  // rating: number;
  // duration: number;
  // description: string;
  // posterUrl: string;
  id: string;
  key: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  author: string;
  publicationYear: number;
  pages: number;
  edition: string;
  copiesLeft: number;
  stockStatus: string;
  rating: number;
  category: string;
  reviews: number;
  publisher: string;
  isFavorite: boolean;
  isInCart: boolean;
}
