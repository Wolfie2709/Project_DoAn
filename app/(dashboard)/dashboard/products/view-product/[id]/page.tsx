"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Next.js 13 app router
import Image from "next/image";
import AddToCartBtn from "@/components/buttons/AddToCartBtn";

type Product = {
  id: number;
  productName: string;
  description: string;
  price: number;
  images: { imageUrl: string }[];
  stock: number;
  brand?: { brandName: string };
  category?: { categoryName: string };
};

const ProductDetailView = () => {
  const params = useParams();
  const { id } = useParams();
  // const id = params.id; // lấy id từ route params
  console.log(id)

  const [product, setProduct] = useState<Product | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        // setLoading(true);
        const res = await fetch(`https://localhost:7240/api/Products/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        alert(err);
        // setError(err.message);
      } finally {
        // setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // // if (loading) return <div>Loading product...</div>;
  // if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{product.productName}</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 h-96 relative bg-gray-100 rounded-md overflow-hidden">
          {product.images && product.images.length > 0 ? (
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

export default ProductDetailView;
