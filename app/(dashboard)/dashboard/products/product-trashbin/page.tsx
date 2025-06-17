"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import Pagination from "@/components/others/Pagination";
import Loader from "@/components/others/Loader";
import { Product, Response } from "@/types";

const ProductTrashbinPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [response, setResponse] = useState<Response>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("productpage") || "1", 10);
  const itemsPerPage = 6;

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("food-storage");
      if (!stored) throw new Error("Bạn chưa đăng nhập");

      const parsed = JSON.parse(stored)?.state;
      if (!parsed?.employee) throw new Error("Không có quyền truy cập");

      setResponse(parsed);
    } catch (err) {
      alert(err);
      router.push("/dashboard");
    }
  }, []);

  const fetchProducts = async () => {
    if (!response?.accessToken) return;
    try {
      const res = await fetch("https://localhost:7240/api/Products/inactive", {
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
      });
      const data: Product[] = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error("❌ Lỗi fetch sản phẩm:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [response]);

  const handleDelete = async (id: number) => {
    if (response?.employee?.position !== "Manager") {
      alert("Bạn không có quyền xoá vĩnh viễn");
      return;
    }

    if (!confirm("Xác nhận xoá vĩnh viễn sản phẩm?")) return;

    try {
      const res = await fetch(
        `https://localhost:7240/api/Products/harddelete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${response.accessToken}`,
          },
        }
      );
      if (res.ok) {
        alert("🗑️ Đã xoá vĩnh viễn");
        fetchProducts();
      } else {
        alert("❌ Xoá thất bại");
      }
    } catch (err) {
      console.error("❌ Error hard delete:", err);
    }
  };

  const handleRestore = async (id: number) => {
    if (response?.employee?.position !== "Manager") {
      alert("Bạn không có quyền khôi phục");
      return;
    }

    if (!confirm("Khôi phục sản phẩm này?")) return;

    try {
      const res = await fetch(
        `https://localhost:7240/api/Products/restore/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${response.accessToken}`,
          },
        }
      );
      if (res.ok) {
        alert("✅ Sản phẩm đã được khôi phục");
        fetchProducts();
      } else {
        alert("❌ Khôi phục thất bại");
      }
    } catch (err) {
      console.error("❌ Error restore:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen max-w-screen-xl w-full mx-auto px-4 py-12 rounded-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          🗑️ Product Trashbin
        </h1>
        <Link
          href="/dashboard/products"
          className="py-2 px-6 rounded-md bg-blue-500 hover:opacity-75 text-white"
        >
          Quay lại danh sách
        </Link>
      </div>

      {paginatedProducts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Không có sản phẩm đã xoá nào.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedProducts.map((product) => (
            <div
              key={product.productId}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md"
            >
              <div className="relative w-full h-64">
                <Image
                  src={product.images?.[0]?.imageUrl || "/placeholder.png"}
                  alt={product.productName}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {product.productName}
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {product.description || "Không có mô tả"}
                </p>
                <div className="mt-4 flex justify-end">
                  <Popover>
                    <PopoverTrigger>
                      <div className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                        <MoreHorizontal />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="text-start space-y-2">
                      <button
                        className="w-full text-start py-2 px-4 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                        onClick={() => handleRestore(product.productId)}
                      >
                        ♻️ Khôi phục
                      </button>
                      <button
                        className="w-full text-start py-2 px-4 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600"
                        onClick={() => handleDelete(product.productId)}
                      >
                        🗑️ Xoá vĩnh viễn
                      </button>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Suspense fallback={<Loader />}>
        <Pagination
          totalPages={Math.ceil(filteredProducts.length / itemsPerPage)}
          currentPage={currentPage}
          pageName="productpage"
        />
      </Suspense>
    </div>
  );
};

export default ProductTrashbinPage;
