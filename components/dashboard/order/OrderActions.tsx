import React from "react";
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

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Order } from "@/types";
import { useEffect, useState } from 'react';
import { Response } from "@/types"

type Props = {
  WhichOrder: Order;
  onStatusUpdated: () => void;
};

const OrderActions = ({ WhichOrder, onStatusUpdated }: Props) => {
  const [response, setResponse] = useState<Response>();

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
      // router.push("/dashboard")
    }
  }

  // useEffect để lấy response từ session
  useEffect(() => {
    getResponse();
  }, []);

  //hàm để cập nhập trạng thái
  const handleStatusChange = async (newStatus: string) => {
    try {
      if (!response?.accessToken) throw new Error("Không có token đăng nhập");
      if (response.employee?.position != "Manager") {
        alert("Ban khong co quyen truy cap");
        throw new Error("Position khong hop le");
      }
      const fetchResponse = await fetch(`https://localhost:7240/api/Orders/${WhichOrder.orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${response.accessToken}`, // Thêm Authorization header
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!fetchResponse.ok) throw new Error("Failed to update status");

      alert("Order status updated!");

      //callback cập nhật trạng thái
      onStatusUpdated();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger className="">
          <div className="flex items-center justify-center hover:bg-slate-200 p-2 rounded-full dark:hover:bg-slate-900 duration-200">
            <MoreHorizontal />
          </div>
        </PopoverTrigger>
        <PopoverContent className="text-start">
          <Link
            href={`/dashboard/orders/${WhichOrder.orderId}`}
            className="py-2 px-4 rounded-md w-full  block hover:bg-slate-200 dark:hover:bg-slate-900"
          >
            View Details
          </Link>
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full text-base px-4 border-none outline-none focus:ring-offset-0 focus:ring-0 focus-within:outline-none hover:bg-slate-200 dark:hover:bg-slate-900">
              <SelectValue placeholder="Change Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Success">Success</SelectItem>
              <SelectItem value="Aborted">Aborted</SelectItem>
            </SelectContent>
          </Select>
          <button className="w-full text-start hover:bg-slate-200 dark:hover:bg-slate-900 py-2 px-4 rounded-md">
            Cancel Order{" "}
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default OrderActions;
