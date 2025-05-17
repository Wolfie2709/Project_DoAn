"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { dummyCategories } from "@/data/category/categoryData";
import { MoreHorizontal } from "lucide-react";
import { Category } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";

const CategoryPage = () => {
  // state variable
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
      try {
        const res = await fetch(`https://localhost:7240/api/Categories`);
        const data: Category[] = await res.json();
  
        setCategories(data);
        // console.log(data)
      } catch (error) {
        console.error("Failed to fetch products", error);
        setCategories([]);
      }
    }
    // Update state with initial values
    useEffect(() => {
      fetchCategories();
    }, []);

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen max-w-screen-xl w-full mx-auto px-4 py-12 m-2 rounded-md">
      <div >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Browse Categories
          </h1>
          <Link
            href={"/dashboard/categories/add-category"}
            className="py-2 px-6 rounded-md bg-blue-500 hover:opacity-60 text-white"
          >
            Add Category
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.categoryId}
              className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md"
            >
              <div className="relative w-full h-[16rem] p-2">
                <Image
                  src={category.images[0] ? category.images[0].imageUrl : ""}
                  fill
                  alt={category.categoryName}
                  className="w-full h-64 object-contain"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {category.categoryName}
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Description
                </p>
                <div className="mt-4 flex space-x-4">
                  
                  {/* Horizontal icons */}
                  <Popover>
                    <PopoverTrigger className="">
                      <div className="flex items-center justify-center hover:bg-slate-200 p-2 rounded-full dark:hover:bg-slate-900 duration-200">
                        <MoreHorizontal />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="text-start">
                      <button className="w-full text-start hover:bg-slate-200 dark:hover:bg-slate-900 py-2 px-4 rounded-md">
                        Delete Category
                      </button>
                    </PopoverContent>
                  </Popover>
                  {/* Add more icons as needed */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
