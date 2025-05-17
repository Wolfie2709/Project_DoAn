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
  // Check if localStorage is available
  const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;

  // Load wishlist items from localStorage on initialization
  const initialWishlistItems = isLocalStorageAvailable && localStorage.getItem('wishlist-items');
  const parsedWishlistItems: Product[] = initialWishlistItems ? JSON.parse(initialWishlistItems) : [];

  return {
    wishlistItems: parsedWishlistItems,
    addToWishlist: (newItem: Product) => {
      set((state) => {
        const existingItem = state.wishlistItems.find((item) => item.productId === newItem.productId);
        return {
          wishlistItems: existingItem ? state.wishlistItems : [...state.wishlistItems, { ...newItem }],
        };
      });
      if (isLocalStorageAvailable) {
        localStorage.setItem('wishlist-items', JSON.stringify(get().wishlistItems));
      }
    },
    removeFromWishlist: (itemId: number) => {
      set((state) => ({
        wishlistItems: state.wishlistItems.filter((item) => item.productId !== item.productId),
      }));
      if (isLocalStorageAvailable) {
        localStorage.setItem('wishlist-items', JSON.stringify(get().wishlistItems));
      }
    },
    isInWishlist: (productId: number) => {
      // Access state through the get function
      const { wishlistItems } = get();
      return wishlistItems.some((item) => item.productId === productId);
    },
  };
});

export default useWishlistStore;
