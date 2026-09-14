import type { Product } from "./product";

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  price: string;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  total: string;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingDepartment: string;
  shippingPostalCode: string | null;
  shippingPhone: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}