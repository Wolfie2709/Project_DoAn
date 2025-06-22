"use client";

import React, { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash } from "lucide-react";
import { useSearchParams } from "next/navigation";

import ProductHeader from "@/components/dashboard/product/ProductHeader";
import ProductActions from "@/components/dashboard/product/ProductActions";
import Loader from "@/components/others/Loader";
import Pagination from "@/components/others/Pagination";
import { Product } from "@/types";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("productpage") || "1", 10);
  const itemsPerPage = 12;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://localhost:7240/api/Products/with-category");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem("food-storage");
    if (!stored) return;

    try {
      const state = JSON.parse(stored)?.state;
      setPosition(state?.employee?.position || null);
    } catch (error) {
      console.error("❌ Error reading session position:", error);
    }
  }, []);

  // 🔍 Filter theo từ khóa tìm kiếm
  const filteredProducts = products.filter((product) =>
    product.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  console.log(products);

  return (
    <div className="max-w-screen-xl mx-auto w-full bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 my-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
        <ProductHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <Link
          href="/dashboard/products/product-trashbin"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition"
        >
          <Trash size={18} /> Trash
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 uppercase text-xs">
              <tr>
                {["Image", "Name", "Price", "Category", "Actions"].map((title) => (
                  <th key={title} className="px-6 py-4 font-medium">
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {paginatedProducts.map((product) => (
                <tr key={product.productId} className="bg-white dark:bg-gray-800">
                  <td className="px-6 py-4">
                    {product.images?.length > 0 ? (
                      <Image
                        src={`http://localhost:5267${product.images[0].imageUrl}`}
                        width={148}
                        height={67}
                        alt={product.productName}
                        className="object-fit"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">{product.productName || "No name"}</td>
                  <td className="px-6 py-4 text-green-600 dark:text-green-400">
                    ${product.price?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {product.category?.categoryName || "No category"}
                  </td>
                  <td className="px-6 py-4">
                    <ProductActions
                      productId={product.productId}
                      onDelete={fetchData}
                      position={position}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <Suspense fallback={<Loader />}>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            pageName="productpage"
          />
        </Suspense>
      </div>
    </div>
  );
};

export default ProductsPage;
