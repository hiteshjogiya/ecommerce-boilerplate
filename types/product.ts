export interface Product {
  id: string;
  slug?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  rating?: number;
  reviews: number;
  href?: string;
}
