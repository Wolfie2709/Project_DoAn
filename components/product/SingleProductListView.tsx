"use client";
import React, { useEffect, useState } from "react";
import RatingReview from "../others/RatingReview";
import Link from "next/link";
import Image from "next/image";
import AddToWishlistBtn from "../buttons/AddToWishlistBtn";
import AddToCartBtn from "../buttons/AddToCartBtn";
import { Product } from "@/types";
import { formatPrice } from "@/lib/formatPrice";

interface ProductImage {
  imageId: number;
  imageUrl: string;
  productId: number;
  mainImage: boolean;
}

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

  const [mainImageUrl, setMainImageUrl] = useState("/placeholder.jpg");

  useEffect(() => {
    const fetchMainImage = async () => {
      try {
        const res = await fetch(`https://localhost:7240/api/Images?productId=${productId}`);
        const data: ProductImage[] = await res.json();
        const mainImage = data.find((img) => img.mainImage) || data[0];
        if (mainImage?.imageUrl) {
          setMainImageUrl(mainImage.imageUrl);
        }
      } catch (error) {
        console.error("Failed to fetch product image", error);
      }
    };

    fetchMainImage();
  }, [productId]);

  const displayPrice = formatPrice(price);
  const displayDiscount = discountedPrice ? formatPrice(discountedPrice) : null;

  return (
    <div className="group flex flex-col lg:flex-row lg:items-start items-center justify-center gap-4 relative space-y-4 p-4 md:p-8 border hover:shadow-md transition">
      {/* Image Section */}
      <Link
        href={`/shop/${productId}`}
        className="flex-shrink-0 w-[20rem] h-[18rem] relative rounded-md overflow-hidden bg-gray-200"
      >
        {product.images?.length > 0 ? (
          <Image
            src={`http://localhost:5267${product.images[0].imageUrl}`}
            fill
            alt={product.productName}
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
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
          {productName?.length > 45 && "..."}
        </Link>

        <div className="text-lg font-bold space-x-2 my-4">
          <span className="text-muted-foreground line-through">${displayPrice}</span>
          {displayDiscount && (
            <span className="text-xl font-bold text-green-500">
              ${displayDiscount}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300">
          {description?.slice(0, 120)}
          {description?.length > 120 && "..."}
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
