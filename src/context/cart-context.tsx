"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";
import { orderTotalCents } from "@/lib/cart-total";

const STORAGE_KEY = "caps-cart-v2";

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; variantId: string }
  | { type: "UPDATE_QUANTITY"; variantId: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items };
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.variantId === action.item.variantId
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i === existing
              ? {
                  ...i,
                  quantity: Math.min(
                    i.stock,
                    i.quantity + action.item.quantity
                  ),
                }
              : i
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter((i) => i.variantId !== action.variantId),
      };
    case "UPDATE_QUANTITY":
      return {
        items: state.items.map((i) =>
          i.variantId === action.variantId
            ? { ...i, quantity: Math.min(i.stock, Math.max(1, action.quantity)) }
            : i
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  hydrated: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  /** Order total the customer pays — delivery counted once, not per cap. */
  totalCents: number;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        // Guard against carts saved before variants existed.
        const valid = parsed.filter((i) => i && typeof i.variantId === "string");
        dispatch({ type: "HYDRATE", items: valid });
      }
    } catch {
      // ignore corrupt storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items, hydrated]);

  const totalCents = orderTotalCents(state.items);
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  const value: CartContextValue = {
    items: state.items,
    hydrated,
    addItem: (item) => dispatch({ type: "ADD_ITEM", item }),
    removeItem: (variantId) => dispatch({ type: "REMOVE_ITEM", variantId }),
    updateQuantity: (variantId, quantity) =>
      dispatch({ type: "UPDATE_QUANTITY", variantId, quantity }),
    clearCart: () => dispatch({ type: "CLEAR" }),
    totalCents,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
