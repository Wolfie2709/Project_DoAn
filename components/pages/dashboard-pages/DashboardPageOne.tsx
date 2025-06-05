"use client";
import HomePageChart from "@/components/dashboard/charts/HomePageChart";
import ProductOverviewChart from "@/components/dashboard/charts/ProductOverviewChart";
import RecentOrdersSection from "@/components/dashboard/order/RecentOrders";
import StatisticsCard from "@/components/dashboard/statistics/StatisticsCard";
import { Employee, Order } from "@/types";
import { Activity, DollarSign, ShoppingBag, Users } from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";

const DashboardPageOne = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeEmployees, setEmployees] = useState<Employee[]>([]);
  //Lay get response

  ///

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

  useEffect(()=>{
    fetchOrders();
  }, [])

  //fetch lay employee
  const fetchEmployees = async () => {
    // if (!response || !response.accessToken) return null;

    try {
      const res = await fetch("https://localhost:7240/api/Employees");
      const data: Employee[] = await res.json();
      const activeEmployees = data.filter((employee) => employee.isDeletedStatus === false);
      setEmployees(activeEmployees);
      // setFilteredBrands(activeBrands);
    } catch (error) {
      console.error("Failed to fetch brands", error);
      setEmployees([]);
      // setFilteredBrands([]);
    }
  };

  useEffect(()=>{
    fetchEmployees();
  }, [])

  //Tinh toan
  var revenue = 0
  orders.forEach((order) =>{
    if(order.totalCost==null){
      revenue+=0
    }
    else{
      revenue+=order.totalCost;
    }
  })

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
          value="$4,000"
          icon={Activity}
        />
        <StatisticsCard
          iconColor="bg-violet-500"
          title="Employees"
          value={activeEmployees.length.toString()}
          icon={Users}
        />
      </div>
      <HomePageChart />
      <RecentOrdersSection recentOrderList={orders.slice(-5)}/>
      <ProductOverviewChart />
    </section>
  );
};

export default DashboardPageOne;
