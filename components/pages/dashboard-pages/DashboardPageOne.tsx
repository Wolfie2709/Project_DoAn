"use client";

import HomePageChart from "@/components/dashboard/charts/HomePageChart";
import ProductOverviewChart from "@/components/dashboard/charts/ProductOverviewChart";
import RecentOrdersSection from "@/components/dashboard/order/RecentOrders";
import StatisticsCard from "@/components/dashboard/statistics/StatisticsCard";
import { Employee, OrderHomeDto, OrderChartDto } from "@/types";
import { Activity, DollarSign, ShoppingBag, Users } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";

const DashboardPageOne = () => {
  const [orders, setOrders] = useState<OrderHomeDto[]>([]);
  const [activeEmployees, setEmployees] = useState<Employee[]>([]);

  // Lấy tất cả orders từ API
  const fetchOrders = async () => {
    try {
      const res = await fetch("https://localhost:7240/api/Orders/HomeChart");
      const json = await res.json();
      if (Array.isArray(json)) {
        setOrders(json);
      } else {
        console.error("API không trả về mảng:", json);
        setOrders([]);
      }
    } catch (error) {
      console.error("Lỗi khi fetch orders:", error);
      setOrders([]);
    }
  };

  // Lấy danh sách employees (lọc active)
  const fetchEmployees = async () => {
    try {
      const res = await fetch("https://localhost:7240/api/Employees");
      const data: Employee[] = await res.json();

      const activeEmployees = data.filter((employee) => employee.isDeletedStatus === false);
      setEmployees(activeEmployees);
    } catch (error) {
      console.error("Lỗi khi fetch employees:", error);
      setEmployees([]);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchEmployees();
  }, []);

  // Tính revenue an toàn bằng useMemo
  const revenue = useMemo(() => {
    const total = orders.reduce((sum, order) => sum + (order.totalCost ?? 0), 0);
    return Math.round(total * 100) / 100;
  }, [orders]);

  return (
    <section className="max-w-screen-xl mx-auto py-4">
      <div className="grid gap-2 lg:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatisticsCard
          iconColor="bg-rose-500"
          title="Revenue"
          value={revenue.toString()}
          icon={DollarSign}
        />
        <StatisticsCard
          iconColor="bg-lime-500"
          title="Sales"
          value="$1,000"
          icon={ShoppingBag}
        />
        <StatisticsCard
          iconColor="bg-rose-500"
          title="Orders"
          value={orders.length.toString()}
          icon={Activity}
        />
        <StatisticsCard
          iconColor="bg-violet-500"
          title="Employees"
          value={activeEmployees.length.toString()}
          icon={Users}
        />
      </div>

      <HomePageChart OrderList={orders} />
      <RecentOrdersSection recentOrderList={orders.slice(-5)} />
      <ProductOverviewChart />
    </section>
  );
};

export default DashboardPageOne;
