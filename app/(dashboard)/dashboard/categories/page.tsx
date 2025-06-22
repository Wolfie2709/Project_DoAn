"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import { Category } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import { useEffect, useState } from "react";
import SearchCategories from "@/components/dashboard/category/SearchCategories";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Pagination from "@/components/others/Pagination";
import Loader from "@/components/others/Loader";
import { Response } from "@/types";
import { Trash } from "lucide-react";

const CategoryPage = () => {
  // state variable
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [response, setResponse] = useState<Response>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = parseInt(searchParams.get("categorypage") || "1", 10);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
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
      router.push("/dashboard/categories")
    }
  }, [response])

  //Call Get api to get all category data
  const fetchCategories = async () => {
    if (!response || !response.accessToken) return null;

    try {
      const res = await fetch(`https://localhost:7240/api/Categories`);
      const data: Category[] = await res.json();

      // Lọc các category có activeStatus là true
      const activeCategories = data.filter(category => category.activeStatus === true);

      setCategories(activeCategories);
      setFilteredCategories(activeCategories);
      console.log(data)
    } catch (error) {
      console.error("Failed to fetch products", error);
      setCategories([]);
      setFilteredCategories([]);
    }
  }
  // Update state with initial values
  useEffect(() => {
    fetchCategories();
  }, [response]);

  // Tìm kiếm theo tên
  const handleSearch = (query: string) => {
    const lowerQuery = query.toLowerCase()
    const results = categories.filter(category =>
      category.categoryName.toLowerCase().includes(lowerQuery)
      // Nếu lowerQuery là rỗng => là true cho mọi chuỗi => lấy về mọi brands
    )
    setFilteredCategories(results);

    // Reset to page 1 after search
    const params = new URLSearchParams(searchParams);
    params.set("categorypage", "1");
    router.replace(`${pathname}?${params}`);
  }

  //Call api to delete a category
  const deleteCategory = async (id: number) => {
    if (!response || !response.accessToken) return;
    if (response.employee?.position != "Manager") {
      alert("Ban khong co quyen truy cap")
      return;
    }
    const confirmed = confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;

    try {
      const res = await fetch(`https://localhost:7240/api/Categories/softdelete/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${response.accessToken}`, // Thêm Authorization header
        }
      });

      if (res.ok) {
        // Refresh lại danh sách
        await fetchCategories();
      } else {
        console.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen max-w-screen-xl w-full mx-auto px-4 py-12 m-2 rounded-md">
      <div >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Browse Categories
          </h1>
          <SearchCategories onSearch={handleSearch} />
          <Link
            href={"/dashboard/categories/add-category"}
            className="py-2 px-6 rounded-md bg-blue-500 hover:opacity-60 text-white"
          >
            Add Category
          </Link>
          <Link
            href={"/dashboard/categories/category-trashbin"}
            className="py-2 px-6 rounded-md bg-blue-500 hover:opacity-60 text-white"
          >
            <Trash />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedCategories.map((category) => (
            <div
              key={category.categoryId}
              className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md"
            >
              <div className="relative w-full h-[16rem] p-2">
                {category.images?.length > 0 ? (
                  <Image
                    src={`http://localhost:5267${category.images[0].imageUrl}`}
                    fill
                    alt={category.categoryName}
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
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
                      <Link
                        href={`/dashboard/categories/addImage/${category.categoryId}`}
                        className="py-2 px-4 rounded-md w-full block hover:bg-slate-200 dark:hover:bg-slate-900"
                      >
                        Add Image
                      </Link>
                      <Link
                        href={`/dashboard/categories/update/${category.categoryId}`}
                        className="py-2 px-4 rounded-md w-full block hover:bg-slate-200 dark:hover:bg-slate-900"
                      >
                        Update Category
                      </Link>
                      <button
                        className="w-full text-start hover:bg-slate-200 dark:hover:bg-slate-900 py-2 px-4 rounded-md"
                        onClick={() => deleteCategory(category.categoryId)}
                      >
                        Delete Category
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
            pageName="categorypage"
          />
        </Suspense>
      </div>
    </div>
  );
};

export default CategoryPage;
