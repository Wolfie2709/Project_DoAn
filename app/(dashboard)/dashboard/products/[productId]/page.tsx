"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

type Product = {
  productId: number;
  productName: string;
  description: string;
  price: number;
  images: { imageUrl: string }[];
  stock: number;
  discount?: number;
  shortDescription?: string;
  brand?: { brandName: string };
  category?: { categoryName: string };
};

const ViewProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://localhost:7240/api/Products/${id}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading product...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen max-w-screen-xl w-full mx-auto px-4 py-12 m-2 rounded-md">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-8">
          Product Information
        </h1>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative h-64 w-full rounded-md overflow-hidden bg-gray-100">
              {product.images?.length > 0 ? (
                <Image
                  src={product.images[0].imageUrl}
                  alt={product.productName}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No image
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Product ID
                </label>
                <p className="text-gray-800 dark:text-white">{product.productId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <p className="text-gray-800 dark:text-white">{product.productName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price
                </label>
                <p className="text-gray-800 dark:text-white">${product.price.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Discount
                </label>
                <p className="text-gray-800 dark:text-white">{product.discount ?? 0}%</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Stock
                </label>
                <p className="text-gray-800 dark:text-white">{product.stock}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <p className="text-gray-800 dark:text-white">{product.category?.categoryName || "N/A"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Brand
                </label>
                <p className="text-gray-800 dark:text-white">{product.brand?.brandName || "N/A"}</p>
              </div>
            </div>

            <div className="col-span-full space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <p className="text-gray-800 dark:text-white">{product.description}</p>
              </div>
              {product.shortDescription && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    About Item
                  </label>
                  <p className="text-gray-800 dark:text-white">{product.shortDescription}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductPage;
