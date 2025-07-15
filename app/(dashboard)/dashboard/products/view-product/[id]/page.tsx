"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Product = {
  productId: number;
  productName: string;
  description: string;
  price: number;
  discount?: number;
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

  const finalPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      {/* 👇 Nút quay lại */}
      <div className="mb-4">
        <Link
          href="/dashboard/products"
          className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition"
        >
          ← Return
        </Link>
      </div>

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

        <div className="md:w-1/2 space-y-4">
          <p className="text-gray-600">Category: {product.category?.categoryName || "N/A"}</p>
          <p className="text-gray-600">Brand: {product.brand?.brandName || "N/A"}</p>
          <p>{product.description}</p>

          {/* 💰 Giá gốc và giá sau discount */}
          <div className="text-2xl font-bold text-gray-800">
            {product.discount && product.discount > 0 ? (
              <div>
                <span className="line-through text-red-500 mr-2">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-green-600">
                  ${finalPrice.toFixed(2)}{" "}
                  <span className="text-sm text-gray-500">({product.discount}% off)</span>
                </span>
              </div>
            ) : (
              <span>${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className="text-gray-700">Stock: {product.stock}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewProductPage;
