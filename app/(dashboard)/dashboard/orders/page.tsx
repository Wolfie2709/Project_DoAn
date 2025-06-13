"use client";
import OrderActions from "@/components/dashboard/order/OrderActions";
import OrderSearch from "@/components/dashboard/order/OrderSearch";
import Loader from "@/components/others/Loader";
import Pagination from "@/components/others/Pagination";
import React, { Suspense } from "react";
import { Order } from "@/types";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

const OrdersPage = () => {
  // Lay api fetch all order with customer
  const [orders, setOrders] = useState<Order[]>([]);
  // const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  //Pagination
  const currentPage = parseInt(searchParams.get("orderpage") || "1", 10);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //lay api get all order
  // Fetch brand data where ActiveStatus is true
  const fetchOrders = async () => {
    // if (!response || !response.accessToken) return null;

    try {
      const res = await fetch("https://localhost:7240/api/Orders/with-customer");
      const data: Order[] = await res.json();
      setOrders(data);
      // setFilteredBrands(activeBrands);
    } catch (error) {
      console.error("Failed to fetch brands", error);
      setOrders([]);
      // setFilteredBrands([]);
    }
  };

  // Handle search input
  const handleSearch = (query: string) => {
    if(query==""){
      fetchOrders();
    }
    const queryID = parseInt(query);
    const results = orders.filter((order) =>
      order.orderId == queryID
    );
    setOrders(results);

    // Reset to page 1 after search
    const params = new URLSearchParams(searchParams);
    params.set("brandpage", "1");
    router.replace(`${pathname}?${params}`);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  //Filter status
  const filterStatus = (statusFiltered: string) =>{
    if (statusFiltered=="All"){
      var query = "";
    }
    else{
      query = statusFiltered;
    }
    const result = orders.filter((order) => order.status == query)
    setOrders(result);

    // Reset to page 1 after search
    const params = new URLSearchParams(searchParams);
    params.set("orderpage", "1");
    router.replace(`${pathname}?${params}`);
  }

  // console.log(paginatedOrders)

  return (
    <div className="max-w-screen-xl mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4 ">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white ">
          Orders
        </h2>
        <OrderSearch onSearch={handleSearch}/>
        <Popover>
          <PopoverTrigger className="">
            <div className="flex items-center justify-center hover:bg-slate-200 p-2 rounded-full dark:hover:bg-slate-900 duration-200">
              <Filter />
            </div>
          </PopoverTrigger>
          <PopoverContent className="text-start">
            <Select onValueChange={filterStatus}>
              <SelectTrigger className="w-full text-base px-4 border-none outline-none focus:ring-offset-0 focus:ring-0 focus-within:outline-none hover:bg-slate-200 dark:hover:bg-slate-900">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Success">Success</SelectItem>
                <SelectItem value="Aborted">Aborted</SelectItem>
              </SelectContent>
            </Select>
          </PopoverContent>
        </Popover>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full w-full divide-y divide-gray-200 dark:divide-gray-700 border dark:border-gray-500 rounded-md">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total money
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 ">
            {paginatedOrders.map((order) => (
              <tr key={order.orderId} className="bg-white dark:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.orderId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.customer.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.totalCost} vnd
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.estimatedDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === "Shipped"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Aborted"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <OrderActions WhichOrder={order} onStatusUpdated={fetchOrders}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* replace these data with your acctuall data */}
        <Suspense fallback={<Loader />}>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            pageName="orderpage"
          />
        </Suspense>
      </div>
    </div>
  );
};

export default OrdersPage;
