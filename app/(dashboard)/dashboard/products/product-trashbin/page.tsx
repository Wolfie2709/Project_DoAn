"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Pagination from "@/components/others/Pagination";
import Loader from "@/components/others/Loader";
import { Product, Response } from "@/types";

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [response, setResponse] = useState<Response>();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = parseInt(searchParams.get("productpage") || "1", 10);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getResponse = () => {
    try {
      const storedData = sessionStorage.getItem("food-storage");
      if (!storedData) throw new Error("Bạn chưa đăng nhập");

      const parsed = JSON.parse(storedData);
      const responseData = parsed?.state;
      if (!responseData || !responseData.employee) throw new Error("Không có quyền truy cập");

      setResponse(responseData);
    } catch (error) {
      alert(error);
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    getResponse();
  }, []);

  const fetchProducts = async () => {
    if (!response || !response.accessToken) return;

    try {
      const res = await fetch("https://localhost:7240/api/Products");
      const data: Product[] = await res.json();
      const deletedProducts = data.filter(p => p.activeStatus === false);
      setProducts(deletedProducts);
      setFilteredProducts(deletedProducts);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [response]);

  const deleteProduct = async (id: number) => {
    if (!response || !response.accessToken) return;
    if (response.employee?.position !== "Manager") {
      alert("Bạn không có quyền truy cập");
      return;
    }
    const confirmed = confirm("Bạn có chắc muốn xóa vĩnh viễn sản phẩm này?");
    if (!confirmed) return;

    try {
      const res = await fetch(`https://localhost:7240/api/Products/harddelete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
      });
      if (res.ok) fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const restoreProduct = async (id: number) => {
    if (!response || !response.accessToken) return;
    if (response.employee?.position !== "Manager") {
      alert("Bạn không có quyền truy cập");
      return;
    }
    const confirmed = confirm("Bạn có chắc muốn khôi phục sản phẩm này?");
    if (!confirmed) return;

    try {
      const res = await fetch(`https://localhost:7240/api/Products/restore/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
      });
      if (res.ok) fetchProducts();
    } catch (error) {
      console.error("Error restoring product:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen max-w-screen-xl w-full mx-auto px-4 py-12 m-2 rounded-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Product Trashbin</h1>
        <Link href="/dashboard/products" className="py-2 px-6 rounded-md bg-blue-500 hover:opacity-60 text-white">
          Active
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedProducts.map((product) => (
          <div key={product.productId} className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md">
            <div className="relative w-full h-[16rem] p-2">
              <Image
                src={product.images?.[0]?.imageUrl || ""}
                fill
                alt={product.productName}
                className="w-full h-64 object-contain"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {product.productName}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">{product.description || "No description"}</p>
              <div className="mt-4 flex space-x-4">
                <Popover>
                  <PopoverTrigger>
                    <div className="flex items-center justify-center hover:bg-slate-200 p-2 rounded-full dark:hover:bg-slate-900 duration-200">
                      <MoreHorizontal />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="text-start">
                    <button
                      className="w-full text-start hover:bg-slate-200 dark:hover:bg-slate-900 py-2 px-4 rounded-md"
                      onClick={() => deleteProduct(product.productId)}
                    >
                      Delete Product
                    </button>
                    <button
                      className="w-full text-start hover:bg-slate-200 dark:hover:bg-slate-900 py-2 px-4 rounded-md"
                      onClick={() => restoreProduct(product.productId)}
                    >
                      Restore Product
                    </button>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Suspense fallback={<Loader />}>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          pageName="productpage"
        />
      </Suspense>
    </div>
  );
};

export default ProductPage;
