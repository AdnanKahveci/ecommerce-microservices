export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stockQuantity: number;
  featured: boolean;
  rating?: number;
  specifications?: Record<string, string>;
}