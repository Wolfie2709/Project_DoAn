// 📁 File: ProductActions.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface ProductActionsProps {
  productId: number;
  onDelete: () => void;
  position: string | null;
}

const ProductActions: React.FC<ProductActionsProps> = ({ productId, onDelete, position }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("food-storage");
    if (!stored) return;

    try {
      const state = JSON.parse(stored)?.state;
      setAccessToken(state?.accessToken || null);
    } catch (error) {
      console.error("❌ Error parsing session:", error);
    }
  }, []);

  const handleSoftDelete = async () => {
    if (!confirm("Are you sure to soft delete this product?")) return;
    if (!accessToken || position !== "Manager") {
      return alert("❌ No permission to delete product.");
    }

    try {
      const res = await fetch(`https://localhost:7240/api/Products/softdelete/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        alert("✅ Product soft deleted.");
        onDelete();
      } else {
        const error = await res.text();
        alert("❌ Failed: " + error);
      }
    } catch (error) {
      console.error("❌ Error soft deleting:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <MoreHorizontal size={18} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 space-y-1">
        <Link
          href={`/dashboard/products/view-product/${productId}`}
          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          View Product
        </Link>
        <Link
          href={`/dashboard/products/add-image/${productId}`}
          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          Add Image
        </Link>
        <Link
          href={`/dashboard/products/update/${productId}`}
          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          Update Product
        </Link>
        {position === "Manager" && (
          <button
            onClick={handleSoftDelete}
            className="w-full text-start px-4 py-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-800 rounded"
          >
            Soft Delete
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ProductActions;

