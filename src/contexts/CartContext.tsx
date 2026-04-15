/**
 * Shopping cart — persisted to localStorage.
 * Enforces one-shop-per-cart: addItem returns "different_shop" if the new
 * product belongs to a different artisan than items already in the cart.
 */

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { CartItem, CartProduct } from "@/types";

const STORAGE_KEY = "mi-tierra-cart";

export type AddItemResult = "added" | "different_shop";

interface CartContextValue {
  items: CartItem[];
  /** Total number of individual units across all line items. */
  itemCount: number;
  /** Sum of price × quantity for all items. */
  subtotal: number;
  /**
   * Returns "added" on success or "different_shop" when the product belongs to
   * a different shop than items already in the cart (cart is not mutated in that case).
   */
  addItem: (product: CartProduct, quantity?: number) => AddItemResult;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      // corrupted storage — start fresh
    }
    setHydrated(true);
  }, []);

  // Persist whenever items change (skip the very first render before hydration)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((product: CartProduct, quantity = 1): AddItemResult => {
    let result: AddItemResult = "added";

    setItems((prev) => {
      // Enforce one shop per cart
      if (prev.length > 0 && prev[0].product.shopId !== product.shopId) {
        result = "different_shop";
        return prev; // leave cart unchanged
      }

      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, i.product.stock) }
            : i
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });

    return result;
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
