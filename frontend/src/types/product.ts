import type { Category } from "./category";

export interface ProductImage {
  id: number;
  productId: number;
  url: string;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  sku: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  categories: Category[];
}

export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: ProductPagination;
}