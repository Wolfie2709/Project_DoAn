'use client'
import React from "react";
import { Button } from "../ui/button";
import { Product } from "@/types";
import useWishlistStore from "@/store/wishlistStore";
import { showToast } from "@/lib/showToast";
import { useAuthStore } from "@/store/authStore";

const AddToWishlistBtn = ({ product }: { product: Product }) => {
  const { addToWishlist, isInWishlist } = useWishlistStore();
  const { customer } = useAuthStore(); // get logged-in customer
  const imageUrl = product.images?.[0]?.imageUrl || "";
  const productName = product.productName || "Product";

  const handleAddToWishList = async () => {
    if (!customer) {
      showToast("Please log in to use the wishlist", imageUrl, productName);
      return;
    }

    if (isInWishlist(product.productId)) {
      showToast("Item already in wishlist", imageUrl, productName);
    } else {
      await addToWishlist(product, customer.customerId);
      showToast("Item added to wishlist", imageUrl, productName);
    }
  };

  return (
    <Button
      onClick={handleAddToWishList}
      variant={"outline"}
      className="w-full p-8 text-xl rounded-full"
    >
      Add To Wishlist
    </Button>
  );
};

export default AddToWishlistBtn;
