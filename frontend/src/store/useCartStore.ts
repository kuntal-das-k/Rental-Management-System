import { create } from 'zustand';
import { Product } from '../types';

export interface CartItem {
  product: Product;
  quantity: number;
  startDate: string;
  endDate: string;
  depositProduct?: Product;
}

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discountType: 'PERCENT' | 'FIXED' | null;
  discountValue: number;
  pickupType: 'DELIVERY' | 'STORE';

  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  setDates: (startDate: string, endDate: string) => void;
  applyCoupon: (code: string, discountType: 'PERCENT' | 'FIXED', discountValue: number) => void;
  setPickupType: (type: 'DELIVERY' | 'STORE') => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: JSON.parse(localStorage.getItem('twinsix_cart') || '[]'),
  couponCode: null,
  discountType: null,
  discountValue: 0,
  pickupType: 'DELIVERY',

  addItem: (newItem) =>
    set((state) => {
      const existingIndex = state.items.findIndex((i) => i.product.id === newItem.product.id);
      let updatedItems = [...state.items];
      if (existingIndex >= 0) {
        updatedItems[existingIndex].quantity += newItem.quantity;
      } else {
        updatedItems.push(newItem);
      }
      localStorage.setItem('twinsix_cart', JSON.stringify(updatedItems));
      return { items: updatedItems };
    }),

  removeItem: (productId) =>
    set((state) => {
      const updatedItems = state.items.filter((i) => i.product.id !== productId);
      localStorage.setItem('twinsix_cart', JSON.stringify(updatedItems));
      return { items: updatedItems };
    }),

  updateQuantity: (productId, delta) =>
    set((state) => {
      const updatedItems = state.items
        .map((i) => {
          if (i.product.id === productId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[];
      localStorage.setItem('twinsix_cart', JSON.stringify(updatedItems));
      return { items: updatedItems };
    }),

  setDates: (startDate, endDate) =>
    set((state) => {
      const updatedItems = state.items.map((i) => ({ ...i, startDate, endDate }));
      localStorage.setItem('twinsix_cart', JSON.stringify(updatedItems));
      return { items: updatedItems };
    }),

  applyCoupon: (code, discountType, discountValue) =>
    set({ couponCode: code, discountType, discountValue }),

  setPickupType: (pickupType) => set({ pickupType }),

  clearCart: () => {
    localStorage.removeItem('twinsix_cart');
    set({ items: [], couponCode: null, discountType: null, discountValue: 0 });
  },
}));

