'use client';
import React, { useMemo, useEffect, useState } from "react";
import {AreaChart, Area, ResponsiveContainer, BarChart,
        Bar, XAxis, YAxis, Tooltip, Legend, } from 'recharts';
import { OrderHomeDto, Category, Brand, CategoryNode } from "@/types";
import {Popover, PopoverTrigger, PopoverContent, } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select";
import { Filter } from "lucide-react";

type Props = {
  OrderList: Array<OrderHomeDto>;
};

const HomePageChart = ({ OrderList }: Props) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`https://localhost:7240/api/Categories`);
      const data: Category[] = await res.json();

      const activeCategories = data.filter(category => category.activeStatus === true);
      const categoryMap = new Map<number, CategoryNode>();
      const roots: CategoryNode[] = [];

      activeCategories.forEach(cat => {
        categoryMap.set(cat.categoryId, { ...cat, children: [] });
      });

      categoryMap.forEach(node => {
        const parentId = node.parentCategoryID;
        if (parentId != null) {
          const parent = categoryMap.get(Number(parentId));
          if (parent) {
            parent.children.push(node);
          }
        } else {
          roots.push(node);
        }
      });

      setCategories(roots); // categories chỉ chứa cha
    } catch (error) {
      console.error("Failed to fetch categories", error);
      setCategories([]);
    }
  };

  //fetch toàn bộ brands
  const fetchBrands = async () => {
    try {
      const res = await fetch("https://localhost:7240/api/Brands");
      const data: Brand[] = await res.json();
      const activeBrands = data.filter(brand => brand.activeStatus === true);
      setBrands(activeBrands);
    } catch (error) {
      console.error("Failed to fetch brands", error);
      setBrands([]);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      console.log("Cây category cha - con:", categories);
    }
  }, [categories]);

  // Set mặc định là năm hiện tại
  useEffect(() => {
    if (!selectedYear) {
      const currentYear = new Date().getFullYear().toString();
      setSelectedYear(currentYear);
    }
  }, [selectedYear]);

  // Lọc đơn hàng theo năm
  const filteredOrders = useMemo(() => {
    if (!selectedYear) return [];
    return OrderList.filter(order => {
      if (!order.orderDate) return false;
      const year = new Date(order.orderDate).getFullYear().toString();
      return year === selectedYear;
    });
  }, [OrderList, selectedYear]);

  // Tạo dữ liệu biểu đồ theo tháng
  const monthlySalesData = useMemo(() => {
    if (!selectedYear) return [];

    const map = new Map<string, number>();

    // Khởi tạo đủ 12 tháng với giá trị 0
    for (let i = 1; i <= 12; i++) {
      const key = `${i.toString().padStart(2, "0")}/${selectedYear}`;
      map.set(key, 0);
    }

    filteredOrders.forEach(order => {
      if (order.orderDate && order.totalCost !== undefined) {
        const date = new Date(order.orderDate);
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const key = `${month}/${selectedYear}`;
        const current = map.get(key) ?? 0;
        map.set(key, current + order.totalCost);
      }
    });

    return Array.from(map.entries()).map(([name, Sales]) => ({
      name,
      Sales: Math.round(Sales * 100) / 100  // Làm tròn 2 chữ số
    }));
  }, [filteredOrders, selectedYear]);

  // console.log(OrderList);

  return (
    <div>
      {/* Filter */}
      <div className="mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center justify-center hover:bg-slate-200 p-2 rounded-full dark:hover:bg-slate-900 duration-200">
              <Filter />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-60 text-start">
            <Select onValueChange={(val) => setSelectedYear(val)} value={selectedYear ?? undefined}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>

            <button
              onClick={() => setSelectedYear(null)}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
            >
              Reset Filter
            </button>
          </PopoverContent>
        </Popover>
      </div>

      {/* Brand Sales */}
      {/* <div className="grid grid-cols-1 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Sales by Brand
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={brandData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Sales" fill="#34D399" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div> */}

      {/* Category Sales */}
      {/* <div className="grid grid-cols-1 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mt-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Sales by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Sales" fill="#3182CE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div> */}

      {/* Biểu đồ Sales theo tháng */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mt-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Sales by Month {selectedYear ? `in ${selectedYear}` : "(Select a year)"}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlySalesData}>
              <XAxis dataKey="name"
                tickFormatter={(value) => `Tháng ${value.split("/")[0]}`} />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="Sales" stroke="#3182CE" fill="#3182CE" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HomePageChart;
