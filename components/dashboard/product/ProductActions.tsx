"use client";

import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

type ProductActionsProps = {
  productId: number;
  onDelete: () => void;
};

const ProductActions: React.FC<ProductActionsProps> = ({ productId, onDelete }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [position, setPosition] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("food-storage");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      const state = parsed?.state;

      if (state?.accessToken) {
        setAccessToken(state.accessToken);
        setPosition(state.employee?.position || null);
      }
    } catch (error) {
      console.error("Error parsing session storage:", error);
    }
  }, []);

  const handleSoftDelete = async () => {
    const confirmDelete = confirm("Are you sure to soft delete (ẩn) this product?");
    if (!confirmDelete) return;

    if (!accessToken || position !== "Manager") {
      alert("Bạn không có quyền soft delete sản phẩm.");
      return;
    }

    try {
      const res = await fetch(`https://localhost:7240/api/Products/softdelete/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        alert("✅ Product soft deleted successfully");
        onDelete(); // reload lại danh sách sản phẩm
      } else {
        const errorText = await res.text();
        console.error("❌ Soft delete failed:", errorText);
        alert("❌ Failed to soft delete product");
      }
    } catch (error) {
      console.error("❌ Soft delete error", error);
      alert("❌ Error deleting product");
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex items-center justify-center hover:bg-slate-200 p-2 rounded-full dark:hover:bg-slate-900 duration-200">
          <MoreHorizontal />
        </div>
      </PopoverTrigger>
      <PopoverContent className="text-start space-y-1">
        <Link
          href={`/dashboard/products/view-product/${productId}`}
          className="block py-2 px-4 rounded-md hover:bg-slate-200 dark:hover:bg-slate-900"
        >
          View Product
        </Link>
        <Link
          href={`/dashboard/products/update/${productId}`}
          className="block py-2 px-4 rounded-md hover:bg-slate-200 dark:hover:bg-slate-900"
        >
          Update Product
        </Link>
        <button
          onClick={handleSoftDelete}
          className="w-full text-start py-2 px-4 rounded-md hover:bg-yellow-100 dark:hover:bg-yellow-900 text-yellow-600"
        >
          Soft Delete
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default ProductActions;
