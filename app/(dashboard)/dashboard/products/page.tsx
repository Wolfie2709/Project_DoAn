"use client";

import React, { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import ProductActions from "@/components/dashboard/product/ProductActions";
import ProductHeader from "@/components/dashboard/product/ProductHeader";
import Loader from "@/components/others/Loader";
import Pagination from "@/components/others/Pagination";
import { Product } from "@/types";

// Component
const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch products with category from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://localhost:7240/api/Products/with-category");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: Product[] = await res.json();
      console.log("Fetched products with category:", data);
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <ProductHeader />
      <div className="overflow-x-auto">
        {loading ? (
          <Loader />
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border dark:border-gray-500">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {products.slice(0, 6).map((product) => (
                <tr key={product.productId} className="bg-white dark:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Image
                      src={product.images?.[0]?.imageUrl || "/placeholder.png"}
                      alt={product.productName || "Product image"}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.productName?.slice(0, 30) || "No name"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.category?.categoryName || "No category"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ProductActions />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Suspense fallback={<Loader />}>
          <Pagination totalPages={10} currentPage={1} pageName="productpage" />
        </Suspense>
      </div>
    </div>
  );
};

export default ProductsPage;

