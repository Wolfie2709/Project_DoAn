"use client";

import React, { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type YearMonthFilterProps = {
  onFilter: (year: string, month: string | null) => void;
  availableYears: string[];
};

const YearMonthFilter: React.FC<YearMonthFilterProps> = ({ onFilter, availableYears }) => {
  const currentYear = new Date().getFullYear().toString();

  const [tempYear, setTempYear] = useState(currentYear);
  const [tempMonth, setTempMonth] = useState<string | null>(null);

  const handleFilter = () => {
    onFilter(tempYear, tempMonth);
  };

  const handleReset = () => {
    setTempYear(currentYear);
    setTempMonth(null);
    onFilter(currentYear, null);
  };

  return (
    <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <Select onValueChange={setTempYear} value={tempYear}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          {availableYears.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={setTempMonth} value={tempMonth ?? undefined}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select Month" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 12 }, (_, i) => {
            const month = (i + 1).toString().padStart(2, "0");
            return (
              <SelectItem key={month} value={month}>
                Tháng {month}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <button
        onClick={handleFilter}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
      >
        Filter
      </button>

      <button
        onClick={handleReset}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition"
      >
        Reset
      </button>
    </div>
  );
};

export default YearMonthFilter;