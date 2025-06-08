"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import SearchCustomers from "@/components/dashboard/customer/SearchCustomer"; // assumed new
import Loader from "@/components/others/Loader";
import Pagination from "@/components/others/Pagination";
import { Customer, Response } from "@/types";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const CustomerPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [response, setResponse] = useState<Response>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = parseInt(searchParams.get("customerpage") || "1", 10);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getResponse = () => {
    try {
      const storedData = sessionStorage.getItem("food-storage");
      if (!storedData) throw new Error("Bạn chưa đăng nhập");

      const parsed = JSON.parse(storedData);
      const responseData = parsed?.state;
      if (!responseData?.employee) throw new Error("Bạn không phải là employee");

      setResponse(responseData);
    } catch (error) {
      alert(error);
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    getResponse();
  }, []);

  useEffect(() => {
    if (!response || !response.accessToken) return;

    try {
      if (!response.employee) {
        throw new Error("Bạn không có quyền truy cập");
      }
    } catch (error) {
      alert(error);
      router.push("/dashboard/customers");
    }
  }, [response]);

  const fetchCustomers = async () => {
    if (!response?.accessToken) return;

    try {
      const res = await fetch("https://localhost:7240/api/Customers");
      const data: Customer[] = await res.json();
      const deletedCustomers = data.filter((c) => c.isDeletedStatus === true);
      setCustomers(deletedCustomers);
      setFilteredCustomers(deletedCustomers);
    } catch (error) {
      console.error("Failed to fetch customers", error);
      setCustomers([]);
      setFilteredCustomers([]);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [response]);

  const handleSearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const results = customers.filter((customer) =>
      customer.fullName?.toLowerCase().includes(lowerQuery)
    );
    setFilteredCustomers(results);

    const params = new URLSearchParams(searchParams);
    params.set("customerpage", "1");
    router.replace(`${pathname}?${params}`);
  };

  const deleteCustomer = async (id: number) => {
    if (!response?.accessToken || response.employee?.position !== "Manager") {
      alert("Bạn không có quyền truy cập");
      return;
    }

    const confirmed = confirm("Are you sure you want to permanently delete this customer?");
    if (!confirmed) return;

    try {
      const res = await fetch(`https://localhost:7240/api/Customers/harddelete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
      });

      if (res.ok) {
        await fetchCustomers();
      } else {
        console.error("Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const restoreCustomer = async (id: number) => {
    if (!response?.accessToken || response.employee?.position !== "Manager") {
      alert("Bạn không có quyền truy cập");
      return;
    }

    const confirmed = confirm("Are you sure you want to restore this customer?");
    if (!confirmed) return;

    try {
      const res = await fetch(`https://localhost:7240/api/Customers/restore/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
      });

      if (res.ok) {
        await fetchCustomers();
      } else {
        console.error("Failed to restore customer");
      }
    } catch (error) {
      console.error("Error restoring customer:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen max-w-screen-xl w-full mx-auto px-4 py-12 m-2 rounded-md">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        Customer Trashbin
      </h1>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <SearchCustomers onSearch={handleSearch} />
          <Link
            href={"/dashboard/customers"}
            className="py-2 px-6 rounded-md bg-blue-500 hover:opacity-60 text-white"
          >
            Active
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedCustomers.map((customer) => (
          <div
            key={customer.customerId}
            className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {customer.fullName}
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
                      onClick={() => deleteCustomer(customer.customerId)}
                    >
                      Delete Customer
                    </button>
                    <button
                      className="w-full text-start hover:bg-slate-200 dark:hover:bg-slate-900 py-2 px-4 rounded-md"
                      onClick={() => restoreCustomer(customer.customerId)}
                    >
                      Restore Customer
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
          pageName="customerpage"
        />
      </Suspense>
    </div>
  );
};

export default CustomerPage;
