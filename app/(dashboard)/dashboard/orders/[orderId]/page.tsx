'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Response } from "@/types"
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React, { Suspense } from "react";
import { OrderedProductDto, OrderDashboardDto } from '@/types';
import Loader from "@/components/others/Loader";
import Pagination from "@/components/others/Pagination";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [response, setResponse] = useState<Response>();
  const [order, setOrder] = useState<OrderDashboardDto>();
  const [orderDetailList, setOrderDetailList] = useState<OrderedProductDto[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = parseInt(searchParams.get("orderdetailpage") || "1", 10);
  const itemsPerPage = 1;
  const totalPages = Math.ceil(orderDetailList.length / itemsPerPage);
  const paginatedOrderDetailsList = orderDetailList.slice(
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

  //Lay ra brand theo id
  useEffect(() => {
    const fetchOrder = async () => {
      if (!response || !response.accessToken) return;
      try {
        const res = await fetch(`https://localhost:7240/api/Orders/OrderWithDetails/${orderId}`, {
          // headers: {
          //   'Authorization': `Bearer ${response?.accessToken}` //Thêm Authorization header
          // }
        });
        const data = await res.json();
        console.log(data)
        setOrder(data);
        setOrderDetailList(data.orderedProducts);
      } catch (error) {
        console.error('Failed to fetch brand:', error);
      }
    };

    fetchOrder();
  }, [response, orderId]);

  // // [response, id, setValue]

  return (
    <div className="max-w-screen-xl w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Order Details
      </h2>

      <Separator className="dark:bg-gray-500 my-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Order Information
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Order Number: {order?.orderId}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Customer Name: {order?.customerName}
          </p>
          <p className="text-gray-700 dark:text-gray-300">Date: {order?.orderDate}</p>
          <p className="text-gray-700 dark:text-gray-300">Date: {order?.estimatedDate}</p>
          <p className="text-gray-700 dark:text-gray-300">
            Status:{" "}
            <span
              className={`inline-flex text-sm font-semibold rounded-full px-2 ${order?.orderStatus === "Shipped"
                ? "bg-green-100 text-green-800"
                : order?.orderStatus === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
                }`}
            >
              {order?.orderStatus}
            </span>
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Shipping Information
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Address: {order?.shippingAddress}
          </p>
          <p className="text-gray-700 dark:text-gray-300">Receiver Name: {order?.receiverName}</p>
          <p className="text-gray-700 dark:text-gray-300">
            Receiver Phone Number: {order?.receiverNumber}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Note: {order?.note}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Ordered Products
        </h3>
        <ul className=" dark:divide-gray-700 my-4 space-y-2">
          {paginatedOrderDetailsList.map((orderDetail) => (
            <li key={orderDetail.orderDetailId} className="">
              <div className="flex justify-between items-center !border dark:border-gray-500 px-2 rounded-md ">
                <p className="text-gray-900 dark:text-white text-lg font-semibold">{orderDetail.productName}</p>
                <div className="w-32 h-32 relative">
                  <Image
                    src={orderDetail?.imageUrl || ""}
                    alt={orderDetail.productName || "place holder"}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-md"
                  />
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Qty : {orderDetail.amount}
                </p>
                <p>Price : {orderDetail.price}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Pagination */}
      <Suspense fallback={<Loader />}>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          pageName="orderdetailpage"
        />
      </Suspense>
      <div className="mt-6 flex items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Total :
        </h3>
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          ${order?.totalPrice}
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;
