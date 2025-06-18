'use client';
import React, { useMemo, useEffect, useState } from "react";
import {
  AreaChart, Area, ResponsiveContainer, BarChart,
  Bar, XAxis, YAxis, Tooltip, Legend,
} from 'recharts';
import { OrderHomeDto, Category, Brand, CategoryParentListDto } from "@/types";
import { Popover, PopoverTrigger, PopoverContent, } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import YearMonthFilter from "../filter/YearMonthFilter";

type Props = {
  OrderList: Array<OrderHomeDto>;
};

const HomePageChart = ({ OrderList }: Props) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<CategoryParentListDto[]>([]);
  
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState<string | null>(currentYear); // mặc định năm hiện tại
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  //fetch toàn bộ categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`https://localhost:7240/api/Categories/ParentWithChildren`);
      const data: CategoryParentListDto[] = await res.json();
      setCategories(data);
      console.log(data)
    } catch (error) {
      console.error("Failed to fetch products", error);
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

  // Set mặc định là năm hiện tại
  useEffect(() => {
    if (!selectedYear) {
      const currentYear = new Date().getFullYear().toString();
      setSelectedYear(currentYear);
    }
  }, [selectedYear]);

  const handleFilter = (year: string, month: string | null) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  // Lọc đơn hàng theo năm và tháng
  const filteredOrders = useMemo(() => {
    const currentYear = new Date().getFullYear().toString();
    const year = selectedYear ?? currentYear;

    return OrderList.filter(order => {
      if (!order.orderDate) return false;
      const date = new Date(order.orderDate);
      const orderYear = date.getFullYear().toString();
      const orderMonth = (date.getMonth() + 1).toString().padStart(2, "0");

      if (orderYear !== year) return false;
      if (selectedMonth && orderMonth !== selectedMonth) return false;

      return true;
    });
  }, [OrderList, selectedYear, selectedMonth]);

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

  //Tạo dữ liệu biểu đồ theo ngày
  const dailySalesData = useMemo(() => {
    if (!selectedYear || !selectedMonth) return [];

    const currentMonth = parseInt(selectedMonth);
    const currentYear = parseInt(selectedYear);

    // Lấy số ngày trong tháng được chọn
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const map = new Map<string, number>();

    for (let i = 1; i <= daysInMonth; i++) {
      const key = `${i.toString().padStart(2, "0")}/${selectedMonth}/${selectedYear}`;
      map.set(key, 0);
    }

    filteredOrders.forEach(order => {
      if (order.orderDate && order.totalCost !== undefined) {
        const date = new Date(order.orderDate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        if (year === currentYear && month === currentMonth) {
          const key = `${day.toString().padStart(2, "0")}/${selectedMonth}/${selectedYear}`;
          const current = map.get(key) ?? 0;
          map.set(key, current + order.totalCost);
        }
      }
    });

    return Array.from(map.entries()).map(([name, Sales]) => ({
      name,
      Sales: Math.round(Sales * 100) / 100
    }));
  }, [filteredOrders, selectedYear, selectedMonth]);

  //Lọc ra các năm tồn tại trong orderList
  const availableYears = useMemo(() => {
    const yearSet = new Set<string>();
    OrderList.forEach((order) => {
      if (order.orderDate) {
        const year = new Date(order.orderDate).getFullYear().toString();
        yearSet.add(year);
      }
    });
    return Array.from(yearSet).sort((a, b) => Number(b) - Number(a)); // Sắp xếp giảm dần
  }, [OrderList]);

  // Sales theo Category cha
  const categorySalesData = useMemo(() => {
    const categoryMap = new Map<number, number>();

    categories.forEach(parent => {
      const allCategoryIds = [parent.categoryId, ...parent.children.map(c => c.categoryId)];
      let totalSales = 0;

      filteredOrders.forEach(order => {
        if (!order.orderCharts || !order.totalCost) return;

        const matched = order.orderCharts.some(chart =>
          chart.categoryId && allCategoryIds.includes(chart.categoryId)
        );

        if (matched) {
          totalSales += order.totalCost;
        }
      });

      categoryMap.set(parent.categoryId, totalSales);
    });

    return categories.map(parent => ({
      name: parent.categoryName ?? `Category ${parent.categoryId}`,
      Sales: Math.round((categoryMap.get(parent.categoryId) ?? 0) * 100) / 100
    }));
  }, [filteredOrders, categories]);

  // Sales theo Brands
  const brandSalesData = useMemo(() => {
    const map = new Map<string, number>();

    brands.forEach((brand) => {
      map.set(brand.brandName, 0);
    });

    filteredOrders.forEach(order => {
      order.orderCharts.forEach(chart => {
        if (chart.brandId && chart.amount) {
          const brand = brands.find(b => b.brandId === chart.brandId);
          if (brand) {
            const prev = map.get(brand.brandName) ?? 0;
            // Phân phối giá trị đơn hàng theo tỷ lệ số lượng
            const itemCost = (order.totalCost ?? 0) * (chart.amount / order.orderCharts.reduce((sum, o) => sum + (o.amount ?? 0), 0));
            map.set(brand.brandName, prev + itemCost);
          }
        }
      });
    });

    return Array.from(map.entries()).map(([name, Sales]) => ({
      name,
      Sales: Math.round(Sales * 100) / 100,
    }));
  }, [filteredOrders, brands]);

  return (
    <div>
      {/* Filter */}
      <YearMonthFilter onFilter={handleFilter} availableYears={availableYears} />

      {/* Brand Sales */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Sales by Brand
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={brandSalesData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Sales" fill="#34D399" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Sales */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mt-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Sales by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categorySalesData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Sales" fill="#34D399" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Biểu đồ Sales theo tháng */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mt-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Sales {selectedMonth ? `theo ngày trong Tháng ${selectedMonth}` : `theo tháng`} {selectedYear ? `năm ${selectedYear}` : ""}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={selectedMonth ? dailySalesData : monthlySalesData}>
              <XAxis
                dataKey="name"
                tickFormatter={(value) => {
                  if (selectedMonth) {
                    return `${value.split("/")[0]}`;
                  } else {
                    return `T ${value.split("/")[0]}`;
                  }
                }}
              />
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
