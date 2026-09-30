export type Role = "USER" | "ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  users: User[];
}

export interface UserResponse {
  message?: string;
  user: User;
}