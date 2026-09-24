import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { PRODUCTS, getTier } from '../data/products';
import type { Product } from '../data/products';

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  savings: number;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  addItem: (productId: string, qty?: number) => void;
  removeItem: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: (demo?: boolean) => void;
  closeCheckout: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const DEMO_ITEMS: { id: string; qty: number }[] = [
  { id: 'mcu-001', qty: 2500 },
  { id: 'sen-006', qty: 750 },
  { id: 'pwr-007', qty: 2500 },
];

function buildItems(list: { id: string; qty: number }[]): CartItem[] {
  return list
    .map(({ id, qty }) => {
      const product = PRODUCTS.find((p) => p.id === id);
      return product ? { product, qty } : null;
    })
    .filter((x): x is CartItem => x !== null);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const addItem = useCallback((productId: string, qty?: number) => {
    setItems((prev) => {
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product) return prev;
      const quantity = qty ?? product.moq;
      const existing = prev.find((i) => i.product.id === productId);
      if (existing) {
        return prev.map((i) =>
          i.product.id === productId ? { ...i, qty: i.qty + quantity } : i
        );
      }
      return [...prev, { product, qty: quantity }];
    });
    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, qty: Math.max(1, qty) } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);

  const openCheckout = useCallback((demo?: boolean) => {
    setItems((prev) => {
      if (prev.length === 0) return buildItems(DEMO_ITEMS);
      return prev;
    });
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    void demo;
  }, []);

  const { count, subtotal, savings } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    let savings = 0;
    for (const item of items) {
      const unit = getTier(item.product, item.qty).unitPrice;
      const base = item.product.tiers[0].unitPrice;
      count += 1;
      subtotal += unit * item.qty;
      savings += (base - unit) * item.qty;
    }
    return { count, subtotal, savings };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      savings,
      isCartOpen,
      isCheckoutOpen,
      addItem,
      removeItem,
      setQty,
      clearCart,
      openCart,
      closeCart,
      openCheckout,
      closeCheckout,
    }),
    [items, count, subtotal, savings, isCartOpen, isCheckoutOpen, addItem, removeItem, setQty, clearCart, openCart, closeCart, openCheckout, closeCheckout]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
