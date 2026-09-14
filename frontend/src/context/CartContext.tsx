import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { apiFetch } from "../api/client";
import { useAuth } from "./AuthContext";
import type { Cart } from "../types/cart";

interface CartResponse {
  cart: Cart;
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { token, isAuthenticated } = useAuth();

  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function refreshCart() {
    if (!token || !isAuthenticated) {
      setCart(null);
      return;
    }

    setIsLoading(true);

    try {
      const data = await apiFetch<CartResponse>("/cart", {
        token,
      });

      setCart(data.cart);
    } catch {
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function addItem(productId: number, quantity = 1) {
  if (!token) {
    throw new Error("Debes iniciar sesión para agregar productos");
  }

  await apiFetch("/cart/items", {
    method: "POST",
    token,
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  await refreshCart();
}

async function updateItem(itemId: number, quantity: number) {
  if (!token) {
    throw new Error("Debes iniciar sesión");
  }

  await apiFetch(`/cart/items/${itemId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify({
      quantity,
    }),
  });

  await refreshCart();
}

  async function removeItem(itemId: number) {
    if (!token) {
      throw new Error("Debes iniciar sesión");
    }

    const data = await apiFetch<CartResponse>(`/cart/items/${itemId}`, {
      method: "DELETE",
      token,
    });

    setCart(data.cart);
  }

  async function clearCart() {
    if (!token) {
      throw new Error("Debes iniciar sesión");
    }

    const data = await apiFetch<CartResponse>("/cart", {
      method: "DELETE",
      token,
    });

    setCart(data.cart);
  }

  useEffect(() => {
    refreshCart();
  }, [token, isAuthenticated]);

  const totalItems =
    cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        refreshCart,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe utilizarse dentro de CartProvider");
  }

  return context;
}