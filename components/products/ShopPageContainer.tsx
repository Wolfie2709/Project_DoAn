"use client";
import React, { Suspense, useEffect, useState } from "react";
import ProductViewChange from "../product/ProductViewChange";
import Pagination from "../others/Pagination";
import SingleProductListView from "@/components/product/SingleProductListView";
import { Product, SearchParams } from "@/types";
import SingleProductCartView from "../product/SingleProductCartView";
import { Loader2 } from "lucide-react";
import Loader from "../others/Loader";

interface ShopPageContainerProps {
  searchParams: SearchParams;
  gridColumn?: number;
}

const ShopPageContainer = ({
  searchParams,
  gridColumn,
}: ShopPageContainerProps) => {
  const [loading, setLoading] = useState(true);
  const [listView, setListView] = useState(false);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [paginatedData, setPaginatedData] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.page) || 1
  );
  const itemsPerPage = 6;

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
  
      // If there's a search keyword, use the search API
      if (searchParams.search) {
        const searchQuery = encodeURIComponent(searchParams.search.trim());
        const res = await fetch(`https://localhost:7240/api/Products/search?query=${searchQuery}&limit=50&featured=false`);
        const data: Product[] = await res.json();
        setFilteredData(data);
        setCurrentPage(1);
        return;
      }
  
      // Otherwise, use the filtering API
      const queryParams: Record<string, string> = {};
      if (searchParams.category) queryParams.categoryId = searchParams.category;
      if (searchParams.brand) queryParams.brandId = searchParams.brand;
      if (searchParams.min) queryParams.min = searchParams.min;
      if (searchParams.max) queryParams.max = searchParams.max;
      if (searchParams.color) queryParams.color = searchParams.color;
  
      const query = new URLSearchParams(queryParams).toString();
      const res = await fetch(`https://localhost:7240/api/Products?${query}`);
      const data: Product[] = await res.json();
      setFilteredData(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(Number(searchParams.page) || 1);
  }, [searchParams.page]);

  useEffect(() => {
    setLoading(true);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // const paginatedProducts = filteredData.slice(startIndex, endIndex);
    setPaginatedData(filteredData);
    setLoading(false);
  }, [filteredData, currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full flex-col gap-3">
        <Loader2 className="animate-spin text-xl" size={50} />
        <p>Loading products..</p>
      </div>
    );
  }

  if (paginatedData.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center flex-col gap-4 text-xl mx-auto font-semibold space-y-4">
        <ProductViewChange
          listView={listView}
          setListView={setListView}
          totalPages={Math.ceil(filteredData.length / itemsPerPage)}
          itemPerPage={itemsPerPage}
          currentPage={currentPage}
        />
        <p>Sorry no result found with your filter selection</p>
      </div>
    );
  }

  return (
    <div className="md:ml-4 p-2 md:p-0">
      <ProductViewChange
        listView={listView}
        setListView={setListView}
        totalPages={Math.ceil(filteredData.length / itemsPerPage)}
        itemPerPage={itemsPerPage}
        currentPage={currentPage}
      />

      {listView === true && (
        <div className="max-w-screen-xl mx-auto overflow-hidden py-4 md:py-8 gap-4 lg:gap-6">
          {paginatedData.map((product) => (
            <SingleProductListView key={product.productId} product={product} />
          ))}
        </div>
      )}

      {listView === false && (
        <div
          className={`max-w-screen-xl mx-auto overflow-hidden py-4 md:py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${
            gridColumn || 3
          } overflow-hidden  gap-4 lg:gap-6`}
        >
          {paginatedData.map((product) => (
            <SingleProductCartView key={product.productId} product={product} />
          ))}
        </div>
      )}

      <Suspense fallback={<Loader />}>
        <Pagination
          totalPages={Math.ceil(filteredData.length / itemsPerPage)}
          currentPage={currentPage}
          pageName="page"
        />
      </Suspense>
    </div>
  );
};

export default ShopPageContainer;
