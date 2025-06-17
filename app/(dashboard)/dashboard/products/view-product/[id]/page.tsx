
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import AddToCartBtn from "@/components/buttons/AddToCartBtn";

type Product = {
  productId: number;
  productName: string;
  description: string;
  price: number;
  images: { imageUrl: string }[];
  stock: number;
  brand?: { brandName: string };
  category?: { categoryName: string };
};

const ViewProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://localhost:7240/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("❌", err);
        alert("Lỗi khi lấy sản phẩm");
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div>⏳ Loading...</div>;

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{product.productName}</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 h-96 relative bg-gray-100 rounded-md overflow-hidden">
          {product.images?.[0]?.imageUrl ? (
            <Image
              src={product.images[0].imageUrl}
              alt={product.productName}
              fill
              className="object-contain"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No image available
            </div>
          )}
        </div>
        <div className="md:w-1/2">
          <p className="mb-2 text-gray-600">Category: {product.category?.categoryName || "N/A"}</p>
          <p className="mb-2 text-gray-600">Brand: {product.brand?.brandName || "N/A"}</p>
          <p className="mb-4">{product.description}</p>
          <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
          <p className="mb-4">Stock: {product.stock}</p>
          <AddToCartBtn product={{ ...product, quantity: 1, selectedColor: "" }} />
        </div>
      </div>
    </div>
  );
};

export default ViewProductPage;

