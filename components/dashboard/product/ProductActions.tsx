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

const ProductActions = ({ productId }: { productId: number }) => {
  const handleDelete = async () => {
    if (!confirm("Are you sure to delete this product?")) return;

    try {
      const res = await fetch(`https://localhost:7240/api/Products/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Product deleted successfully");
        window.location.reload(); // hoặc gọi hàm refetchData
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex items-center justify-center hover:bg-slate-200 p-2 rounded-full dark:hover:bg-slate-900 duration-200">
          <MoreHorizontal />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Link href={`/dashboard/products/${productId}`}>View Product</Link>
        <Link href={`/dashboard/products/edit/${productId}`}>Update Product</Link>
        <button onClick={handleDelete} className="w-full text-start hover:bg-slate-200 dark:hover:bg-slate-900 py-2 px-4 rounded-md">
          Delete Product
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default ProductActions;
