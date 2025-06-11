'use client';
import { Product } from '@/types';
import { create } from 'zustand';

interface WishlistState {
  wishlistItems: Product[];
  addToWishlist: (newItem: Product) => void;
  removeFromWishlist: (itemId: number) => void;
  isInWishlist: (itemId: number) => boolean;
}

const useWishlistStore = create<WishlistState>((set, get) => {
  let parsedWishlistItems: Product[] = [];

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('wishlist-items');
    parsedWishlistItems = stored ? JSON.parse(stored) : [];
  }

  return {
    wishlistItems: parsedWishlistItems,
    addToWishlist: (newItem: Product) => {
      const { wishlistItems } = get();

      const exists = wishlistItems.some(
        (item) => item.productId === newItem.productId
      );

      if (exists) return;

      const updatedList = [...wishlistItems, { ...newItem }];

      set(() => ({
        wishlistItems: updatedList,
      }));

      if (typeof window !== 'undefined') {
        localStorage.setItem('wishlist-items', JSON.stringify(updatedList));
      }
    },

    removeFromWishlist: (itemId: number) => {
      const updatedList = get().wishlistItems.filter(
        (item) => item.productId !== itemId
      );

      set({ wishlistItems: updatedList });

      if (typeof window !== 'undefined') {
        localStorage.setItem('wishlist-items', JSON.stringify(updatedList));
      }
    },

    isInWishlist: (itemId: number) => {
      return get().wishlistItems.some((item) => item.productId === itemId);
    },
  };
});


export default useWishlistStore;
