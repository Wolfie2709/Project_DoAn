'use client'
import React from "react";
import { Button } from "../ui/button";
import { Product,} from "@/types";
import useWishlistStore from "@/store/wishlistStore";
import { showToast } from "@/lib/showToast";


const AddToWishlistBtn = ({product}:{product:Product}) => {
  const {addToWishlist,isInWishlist} = useWishlistStore()
  const imageUrl = product.images?.[0]?.imageUrl || "";
  const productName = product.productName || "Product";

  const handleAddToWishList = () => {
    if(isInWishlist(product.productId)){
      showToast('Item Already Exist In Wishlist',imageUrl, productName)
    }else{
      addToWishlist(product);
      showToast('Item Added To The Wishlist',imageUrl, productName)
    }
  }

  return (
    <Button onClick={(handleAddToWishList)} variant={"outline"} className="w-full p-8 text-xl rounded-full">
      {" "}
      Add To Wishlist
    </Button>
  );
};

export default AddToWishlistBtn;
