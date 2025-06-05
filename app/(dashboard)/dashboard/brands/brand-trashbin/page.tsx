"use client";
import BrandActions from "@/components/dashboard/brand/BrandActions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import SearchBrands from "@/components/dashboard/brand/SearchBrands";
import Loader from "@/components/others/Loader";
import Pagination from "@/components/others/Pagination";
import { Brand } from "@/types"
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Response } from "@/types"
import { Button } from "@/components/ui/button";

const BrandPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [response, setResponse] = useState<Response>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = parseInt(searchParams.get("brandpage") || "1", 10);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //Ham lay get response
  const getResponse = () => {
    try {
      //lay value tu session storage
      const storedData = sessionStorage.getItem("food-storage");
      if (storedData == null) {
        throw new Error("Ban chua dang nhap")
      }

      //lay ra noi dung ben trong storedData
      const parsed = JSON.parse(storedData);
      if (parsed == null) {
        throw new Error("Ban chua dang nhap: loi o parsed")
      }

      //Lay ra response
      const responseData = parsed.state;
      if (responseData == null) {
        throw new Error("Ban chua dang nhap: loi o response")
      }

      if (responseData.employee == null) {
        throw new Error("Ban khong phai la employee")
      }
      setResponse(responseData);
    } catch (error) {
      alert(error);
      router.push("/dashboard")
    }
  }

  // useEffect để lấy response từ session
  useEffect(() => {
    getResponse();
  }, []);

  //Kiem tra truy cap hop le
  useEffect(() => {
    if (!response || !response.accessToken) return;

    //prevent clerk from access update view
    try {
      if (response.employee == null) {
        throw new Error("Ban khong co quyen truy cap")
      }
    } catch (error) {
      alert(error)
      router.push("/dashboard/brands")
    }
  }, [response])

  useEffect(() => {
    if (!response) return;
    console.log(response);
  }, [response]);

  // Fetch brand data where ActiveStatus is false
  const fetchBrands = async () => {
    if (!response || !response.accessToken) return null;

    try {
      const res = await fetch("https://localhost:7240/api/Brands");
      const data: Brand[] = await res.json();
      const activeBrands = data.filter((brand) => brand.activeStatus === false);
      setBrands(activeBrands);
      setFilteredBrands(activeBrands);
    } catch (error) {
      console.error("Failed to fetch brands", error);
      setBrands([]);
      setFilteredBrands([]);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [response]);

  // Handle search input
  const handleSearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const results = brands.filter((brand) =>
      brand.brandName.toLowerCase().includes(lowerQuery)
    );
    setFilteredBrands(results);

    // Reset to page 1 after search
    const params = new URLSearchParams(searchParams);
    params.set("brandpage", "1");
    router.replace(`${pathname}?${params}`);
  };

  // Handle hard deletion
  const deleteBrand = async (id: number) => {
    if (!response || !response.accessToken) return;
    if (response.employee?.position != "Manager") {
      alert("Ban khong co quyen truy cap")
      return;
    }
    const confirmed = confirm("Are you sure you want to delete this brand?");
    if (!confirmed) return;

    try {
      const res = await fetch(`https://localhost:7240/api/Brands/harddelete/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${response.accessToken}`, // Thêm Authorization header
        }
      });

      if (res.ok) {
        await fetchBrands();
      } else {
        console.error("Failed to delete brand");
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  //Handle Restore
  const restoreBrand = async (id: number) => {
    if (!response || !response.accessToken) return;
    if (response.employee?.position != "Manager") {
      alert("Ban khong co quyen truy cap")
      return;
    }
    const confirmed = confirm("Are you sure you want to restore this brand?");
    if (!confirmed) return;

    try {
      const res = await fetch(`https://localhost:7240/api/Brands/restore/${id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${response.accessToken}`, // Thêm Authorization header
        }
      });

      if (res.ok) {
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Brand Trashbin
        </h1>
        <SearchBrands onSearch={handleSearch} />
        <Link
          href={"/dashboard/brands"}
          className="py-2 px-6 rounded-md bg-blue-500 hover:opacity-60 text-white"
        >
          Active
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedBrands.map((brand) => (
          <div
            key={brand.brandId}
            className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md"
          >
            <div className="relative w-full h-[16rem] p-2">
              <Image
                src={brand.images[0]?.imageUrl || ""}
                fill
                alt={brand.brandName}
                className="w-full h-64 object-contain"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {brand.brandName}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">Description</p>
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
                      onClick={() => deleteBrand(brand.brandId)}
                    >
                      Delete Brand
                    </button>
                    <button
                      className="w-full text-start hover:bg-slate-200 dark:hover:bg-slate-900 py-2 px-4 rounded-md"
                      onClick={() => restoreBrand(brand.brandId)}
                    >
                      Restore Brand
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
          pageName="brandpage"
        />
      </Suspense>
    </div>
  );
};

export default BrandPage;
