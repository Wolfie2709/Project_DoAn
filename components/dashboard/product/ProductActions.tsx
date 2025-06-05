"use client";

import React from "react";
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
  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure to delete this product?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://localhost:7240/api/Products/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("✅ Product deleted successfully");
        onDelete(); // Gọi lại fetchData bên ngoài
      } else {
        const errorText = await res.text();
        console.error("❌ Failed to delete:", errorText);
        alert("❌ Failed to delete product");
      }
    } catch (error) {
      console.error("❌ Delete error", error);
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
          href={`/dashboard/products/${productId}`}
          className="block py-2 px-4 rounded-md hover:bg-slate-200 dark:hover:bg-slate-900"
        >
          View Product
        </Link>
        <Link
          href={`/dashboard/products/edit/${productId}`}
          className="block py-2 px-4 rounded-md hover:bg-slate-200 dark:hover:bg-slate-900"
        >
          Update Product
        </Link>
        <button
          onClick={handleDelete}
          className="w-full text-start py-2 px-4 rounded-md hover:bg-red-100 dark:hover:bg-red-900 text-red-600"
        >
          Delete Product
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default ProductActions;
