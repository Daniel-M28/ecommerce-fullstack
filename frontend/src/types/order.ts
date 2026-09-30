import type { Product } from "./product";

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderUser {
  id: number;
  name: string;
  email: string;
}

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
  user?: OrderUser;
}

export interface OrdersResponse {
  orders: Order[];
}

export interface OrderResponse {
  message?: string;
  order: Order;
}