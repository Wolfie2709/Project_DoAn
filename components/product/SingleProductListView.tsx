"use client";
import React from "react";
import RatingReview from "../others/RatingReview";
import Link from "next/link";
import Image from "next/image";
import AddToWishlistBtn from "../buttons/AddToWishlistBtn";
import AddToCartBtn from "../buttons/AddToCartBtn";
import { Product } from "@/types";
import { formatPrice } from "@/lib/formatPrice";

const SingleProductListView = ({ product }: { product: Product }) => {
  const {
    productId,
    productName,
    description,
    price,
    discountedPrice,
    category,
    images,
  } = product;

  const displayPrice = formatPrice(price);
  const displayDiscount = discountedPrice ? formatPrice(discountedPrice) : null;
  const imageUrl = images?.[0]?.imageUrl || "/placeholder.jpg";

  return (
    <div
      className="group flex flex-col lg:flex-row lg:items-start items-center justify-center gap-4 relative space-y-4 p-4 md:p-8 border hover:shadow-md transition"
    >
      {/* Image Section */}
      <Link
        href={`/shop/${productId}`}
        className="flex-shrink-0 w-[20rem] h-[18rem] relative rounded-md overflow-hidden bg-gray-200"
      >
        <Image
          className="object-contain"
          src={imageUrl}
          alt={productName}
          fill
        />
      </Link>

      {/* Product Details Section */}
      <div className="flex flex-col flex-1">
        <p className="text-sm text-sky-500 font-light">
          {category?.categoryName}
        </p>
        <Link
          href={`/shop/${productId}`}
          className="text-xl font-semibold capitalize hover:text-green-500"
        >
          {productName?.slice(0, 45)}
          {productName.length > 45 && "..."}
        </Link>

        {/* RatingReview can be used here if enabled */}
        {/* <RatingReview rating={rating} review={reviews.length} /> */}

        <div className="text-lg font-bold space-x-2 my-4">
          <span className="text-muted-foreground line-through">${displayPrice}</span>
          {displayDiscount && (
            <span className="text-xl font-bold text-green-500">
              ${displayDiscount}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300">
          {product.description?.slice(0, 120)}{product.description?.length > 120 && "..."}
        </p>

        <div
          className="flex flex-col md:flex-row mt-4 items-center gap-2 max-w-96 ml-auto justify-end"
          onClick={(e) => e.stopPropagation()}
        >
          <AddToWishlistBtn product={product} />
          <AddToCartBtn product={{ ...product, quantity: 1, selectedColor: "" }} />
        </div>
      </div>
    </div>
  );
};

export default SingleProductListView;
