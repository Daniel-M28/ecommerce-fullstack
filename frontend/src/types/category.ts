export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}