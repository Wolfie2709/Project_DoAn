'use client';
import { Product } from '@/types';
import { create } from 'zustand';

interface WishlistState {
  wishlistItems: Product[];
  addToWishlist: (newItem: Product, customerId: number) => Promise<void>;
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
    addToWishlist: async (product: Product, customerId: number) => {
      const { wishlistItems } = get();
    
      if (wishlistItems.some((item) => item.productId === product.productId)) return;
    
      try {
        const res = await fetch("https://localhost:7240/api/Wishlists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId,
            productId: product.productId,
          }),
        });
    
        const data = await res.json(); // assume response contains { wishlistId }
    
        const productWithWishlistId = {
          ...product,
          wishlistId: data.wishlistId, // ← Inject custom field directly
        };
    
        const updatedList = [...wishlistItems, productWithWishlistId];
    
        set({ wishlistItems: updatedList });
    
        if (typeof window !== "undefined") {
          localStorage.setItem("wishlist-items", JSON.stringify(updatedList));
        }
      } catch (error) {
        console.error("Failed to add to wishlist", error);
      }
    },
   
    removeFromWishlist: async (productId: number) => {
      const { wishlistItems } = get();
    
      const product = wishlistItems.find(item => item.productId === productId);
    
      if (!product || !product.wishlistId) {
        console.warn("No wishlistId found for this product.");
        return;
      }
    
      try {
        await fetch(`https://localhost:7240/api/Wishlists/${product.wishlistId}`, {
          method: "DELETE",
        });
    
        const updatedList = wishlistItems.filter(
          (item) => item.productId !== productId
        );
    
        set({ wishlistItems: updatedList });
    
        if (typeof window !== "undefined") {
          localStorage.setItem("wishlist-items", JSON.stringify(updatedList));
        }
      } catch (error) {
        console.error("Failed to remove from wishlist", error);
      }
    },
    
    

    isInWishlist: (itemId: number) => {
      return get().wishlistItems.some((item) => item.productId === itemId);
    },
  };
});


export default useWishlistStore;
