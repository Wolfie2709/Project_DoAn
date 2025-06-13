"use client";

import React, { useEffect, useState } from "react";
import RatingReview from "../others/RatingReview";
import Link from "next/link";
import Image from "next/image";
import ProductOptions from "./ProductOptions";
import { Product } from "@/types";
import { useRouter } from "next/navigation";

const SingleProductCartView = ({ product }: { product: Product }) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const {
    productId,
    productName,
    stock,
    price,
    brandID,
    categoryID,
    brand,
    category,
    discountedPrice,
    images,
  } = product;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const imageUrl = images?.[0]?.imageUrl || "/placeholder.jpg";

  return (
    <Link
      href={`/shop/${productId}`}
      className="relative border rounded-xl shadow-lg overflow-hidden group"
    >
      <div className="w-full bg-gray-200 overflow-hidden">
        <div className="relative w-full h-[18rem] group-hover:scale-110 transition-all duration-300 rounded-md overflow-hidden">
          <Image
            className="object-contain"
            src={imageUrl}
            alt={productName || "Product Image"}
            fill
          />
          {stock === 0 && (
            <p className="py-1 px-4 text-sm font-bold rounded-sm bg-rose-500 text-white absolute top-2 right-2">
              Out of stock
            </p>
          )}
        </div>
      </div>

      <div className="hidden group-hover:block slideCartOptions absolute top-16 right-2">
        <ProductOptions product={product} />
      </div>

      <div className="my-2 space-y-1 p-4">
        <p
          onClick={(e) => {
            e.preventDefault();
            router.push(`/shop?category=${category?.categoryName}`);
          }}
          className="text-sm text-sky-500 font-light -mb-1 hover:opacity-60"
        >
          {category?.categoryName}
        </p>

        {productName && (
          <h3 className="text-xl font-bold capitalize hover:text-green-500">
            {productName.slice(0, 45)}
            {productName.length > 45 && "..."}
          </h3>
        )}

        {/* You can enable this if rating data is available */}
        {/* <RatingReview rating={rating} review={reviews.length} /> */}

        <div className="text-lg font-bold space-x-3">
          <span className="text-white-600">${price}</span>
          {discountedPrice && (
            <span className="text-xl font-bold text-green-500">
              ${discountedPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SingleProductCartView;
