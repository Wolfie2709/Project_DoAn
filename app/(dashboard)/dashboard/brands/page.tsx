"use client";
import BrandActions from "@/components/dashboard/brand/BrandActions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import SearchBrands from "@/components/dashboard/brand/SearchBrands";
import Loader from "@/components/others/Loader";
import Pagination from "@/components/others/Pagination";
import { blogPosts } from "@/data/blog/blogData";
import { Brand } from "@/types"
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import { useEffect, useState } from "react";

const BrandPage = () => {

  //Fetch api to get all brands
  const [brands, setBrands] = useState<Brand[]>([]);
  
    //Call Get api to get all brand data
    const fetchBrands = async () => {
        try {
          const res = await fetch(`https://localhost:7240/api/Brands`);
          const data: Brand[] = await res.json();
    
          // Lọc các Brand có activeStatus là true
          const activeBrands = data.filter(brand => brand.activeStatus === true);

          setBrands(activeBrands);
          console.log(data)
        } catch (error) {
          console.error("Failed to fetch products", error);
          setBrands([]);
        }
      }
      // Update state with initial values
      useEffect(() => {
        fetchBrands();
      }, []);
    
  //Call api to delete a brand
  const deleteBrand = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this brand?");
    if (!confirmed) return;

    try {
      const res = await fetch(`https://localhost:7240/api/Brands/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Refresh lại danh sách
        await fetchBrands();
      } else {
        console.error("Failed to delete brand");
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen max-w-screen-xl w-full mx-auto px-4 py-12 m-2 rounded-md">
      <div >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Browse Brands
          </h1>
          <Link
            href={"/dashboard/brands/add-brand"}
            className="py-2 px-6 rounded-md bg-blue-500 hover:opacity-60 text-white"
          >
            Add Brand
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand) => (
            <div
              key={brand.brandId}
              className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md"
            >
              <div className="relative w-full h-[16rem] p-2">
                <Image
                  src={brand.images[0] ? brand.images[0].imageUrl : ""}
                  fill
                  alt={brand.brandName}
                  className="w-full h-64 object-contain"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {brand.brandName}
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
                      <button
                        className="w-full text-start hover:bg-slate-200 dark:hover:bg-slate-900 py-2 px-4 rounded-md"
                        onClick={() => deleteBrand(brand.brandId)}
                      >
                        Delete Brand
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

export default BrandPage;
