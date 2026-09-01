"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  CART_STORAGE_KEY,
  cartItemCount,
  getCartTotals,
  mergeCartItem,
  type CartItem,
  type CartTotals,
} from "@/lib/cart";

type CartContextValue = {
  items: CartItem[];
  count: number;
  totals: CartTotals;
  ready: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem, options?: { open?: boolean }) => void;
  setQty: (variantId: string, qty: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const EMPTY_ITEMS: CartItem[] = [];
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY_ITEMS;

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function parseItems(raw: string | null): CartItem[] {
  if (!raw) return EMPTY_ITEMS;
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) return EMPTY_ITEMS;
    return parsed;
  } catch {
    return EMPTY_ITEMS;
  }
}

function getSnapshot() {
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  cachedItems = parseItems(raw);
  return cachedItems;
}

function getServerSnapshot() {
  return EMPTY_ITEMS;
}

function writeItems(items: CartItem[]) {
  cachedItems = items;
  cachedRaw = JSON.stringify(items);
  localStorage.setItem(CART_STORAGE_KEY, cachedRaw);
  emit();
}

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useHydrated();
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((item: CartItem, options?: { open?: boolean }) => {
    writeItems(mergeCartItem(getSnapshot(), item));
    if (options?.open !== false) setIsOpen(true);
  }, []);

  const setQty = useCallback((variantId: string, qty: number) => {
    writeItems(
      getSnapshot().flatMap((item) => {
        if (item.variantId !== variantId) return [item];
        if (qty < 1) return [];
        return [{ ...item, qty: Math.min(qty, item.stock) }];
      })
    );
  }, []);

  const removeItem = useCallback((variantId: string) => {
    writeItems(getSnapshot().filter((item) => item.variantId !== variantId));
  }, []);

  const clearCart = useCallback(() => writeItems(EMPTY_ITEMS), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: cartItemCount(items),
      totals: getCartTotals(items),
      ready,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      setQty,
      removeItem,
      clearCart,
    }),
    [items, ready, isOpen, addItem, setQty, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
