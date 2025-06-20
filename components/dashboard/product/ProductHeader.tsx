"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import React from "react";

interface ProductHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2 items-center justify-between mb-4 w-full">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Products
      </h2>

      <div className="flex items-center gap-4 w-full lg:w-auto">
        <Input
          placeholder="Search products by name"
          className="p-5 rounded-md w-full lg:w-96"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <Link
          href="/dashboard/products/add-product"
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg whitespace-nowrap"
        >
          New Product
        </Link>
      </div>
    </div>
  );
};

export default ProductHeader;
