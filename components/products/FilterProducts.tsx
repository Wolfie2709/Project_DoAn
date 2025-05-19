"use client";
import React, { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { colors } from "@/data/products/productColor";
import { dummyCategories } from "@/data/category/categoryData";
<<<<<<< HEAD
import { Brand } from "@/types";
import { Category } from "@/types";
=======
import { Brand, Category } from "@/types";
>>>>>>> 980234cb970b995929a2c12ce18eefb033752fba

const FilterProducts = () => {
  // State variables for filters
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [minValue, setMinValue] = useState(10);
  const [maxValue, setMaxValue] = useState(5000);
<<<<<<< HEAD
  const [categories, setCategories] = useState<Category[]>([]);
=======
  const [selectedCategory, setSelectedCategory] = useState(0);
>>>>>>> 980234cb970b995929a2c12ce18eefb033752fba
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);

  // Access search params
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // Get filter values from search params on initial render
  const initialPrice = searchParams.get("max") || "5000";
  const initialCategory = searchParams.get("category");
  const initialColor = searchParams.get("color");
  const initialBrand = searchParams.get("brand");

  const fetchBrands = async() => {
    try{
        const res = await fetch(`https://localhost:7240/api/Brands`);
        const data: Brand[] = await res.json();
  
        setBrands(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
        setBrands([]);
      }
  }
  const fetchCategories = async () => {
    try {
      const res = await fetch(`https://localhost:7240/api/Categories`);
      const data: Category[] = await res.json();

<<<<<<< HEAD
  const fetchCategories = async() => {
    try{
        const res = await fetch(`https://localhost:7240/api/Categories`);
        const data: Category[] = await res.json();
  
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
        setCategories([]);
      }
  }

=======
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setBrands([]);
    }
  }
>>>>>>> 980234cb970b995929a2c12ce18eefb033752fba
  // Update state with initial values
  useEffect(() => {
    fetchBrands();
    fetchCategories();
    setMaxValue(Number(initialPrice));
<<<<<<< HEAD
=======
    fetchCategories();
>>>>>>> 980234cb970b995929a2c12ce18eefb033752fba
    setSelectedColor(initialColor as string);
  }, [initialPrice, initialCategory, initialColor, initialBrand]);

  // Selection handler functions with search param updates
  const handleCategorySelection = (categoryId: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
<<<<<<< HEAD
    if (categoryId === selectedCategory) {
      newSearchParams.delete("category");
    } else {
      newSearchParams.set("category", categoryId.toString());
=======
    if (categoryId === selectedBrand) {
      newSearchParams.delete("category");
    } else {
      newSearchParams.set("category", categoryId.toString());

>>>>>>> 980234cb970b995929a2c12ce18eefb033752fba
    }
    setSelectedCategory(categoryId);
    router.push(`${pathname}?${newSearchParams}`);
  };

  // Update min price and max price with correct values
  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMinValue = Number(event.target.value);
    setMinValue(newMinValue);
    setMinAndMaxPrice(newMinValue, maxValue);
  };

  // Update max price with correct value
  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMaxValue = Number(event.target.value);
    setMaxValue(newMaxValue);
    setMinAndMaxPrice(minValue, newMaxValue);
  };

  // Update search params with correct price range
  const setMinAndMaxPrice = (minPrice: number, maxPrice: number) => {
    const min = Math.min(minPrice, maxPrice);
    const max = Math.max(minPrice, maxPrice);

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("min", `${min}`);
    newSearchParams.set("max", `${max}`);
    router.push(`${pathname}?${newSearchParams}`);
  };

  const handleColorSelection = (color: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (color === selectedColor) {
      newSearchParams.delete("color");
    } else {
      newSearchParams.set("color", color.split("-")[0]);
    }
    setSelectedColor(color);
    router.push(`${pathname}?${newSearchParams}`);
  };

  const handleBrandSelection = (brandId: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (brandId === selectedBrand) {
      newSearchParams.delete("brand");
    } else {
        newSearchParams.set("brand", brandId.toString());
      
    }
    setSelectedBrand(brandId);
    router.push(`${pathname}?${newSearchParams}`);
  };

  const clearFilter = () => {
    router.push(`${pathname}?page=1`);
  };

  return (
    <aside className="w-72 p-2 space-y-4 ">
      <h2 className="text-xl font-bold capitalize my-2">Filter Products</h2>
      <Separator />
      {/* filter by price */}
      <div>
        <h3 className="text-lg font-medium my-2">By Price</h3>
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label htmlFor="min">Min :</Label>
            <Input
              id="min"
              placeholder="$10"
              value={minValue}
              min={2}
              type="number"
              onChange={handleMinPriceChange}
            />
          </div>
          <div>
            <Label htmlFor="max">Max :</Label>
            <Input
              id="max"
              placeholder="$2000"
              min={2}
              value={maxValue}
              type="number"
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>
        <div className="flex items-center justify-center flex-wrap">
          <Input
            onChange={handleMaxPriceChange}
            type="range"
            min={5}
            max={5000}
            value={maxValue}
          />
          <p className="text-center text-green-500 text-2xl">${maxValue}</p>
        </div>
      </div>

      {/* filter by category */}
      <div>
        <h3 className="text-lg font-medium my-2">By Categories</h3>
        <div className="flex items-center justify-start gap-2 flex-wrap">
          {categories.map((category) => (
            <p
              onClick={() => handleCategorySelection(category.categoryId)}
              className={cn(
                "px-4 py-1 rounded-full bg-slate-200 dark:bg-slate-700 cursor-pointer",
                category.categoryId === selectedCategory &&
                  "bg-blue-400 dark:bg-blue-700"
              )}
              key={category.categoryId}
            >
              {category.categoryName}
            </p>
          ))}
        </div>
      </div>

      {/* filter by Colors */}
      <div>
        <h3 className="text-lg font-medium my-2">By Colors</h3>
        <div className="flex items-center justify-start gap-2 flex-wrap">
          {colors.map((color) => (
            <p
              onClick={() => handleColorSelection(color)}
              className={cn(
                "px-4 py-1 rounded-full bg-slate-200 dark:bg-slate-700  flex items-center justify-start gap-3 cursor-pointer",
                color === selectedColor && "bg-blue-400 dark:bg-blue-700"
              )}
              key={color}
            >
              <span
                className={`w-6 h-6 rounded-full border opacity-80`}
                style={{ backgroundColor: color }}
              />
              {color.split("-")[0]}
            </p>
          ))}
        </div>
      </div>

      {/* filter by Brand name */}
      <div>
        <h3 className="text-lg font-medium my-2">By Brands</h3>
        <div className="flex items-center justify-start gap-2 flex-wrap">
          {brands.map((brand) => (
            <p
              onClick={() => handleBrandSelection(brand.brandId)}
              className={cn(
                "px-4 py-1 rounded-full bg-slate-200 dark:bg-slate-700 cursor-pointer",
                selectedBrand === brand.brandId && "bg-blue-400 dark:bg-blue-700"
              )}
              key={brand.brandId}
            >
              {brand.brandName}
            </p>
          ))}
        </div>
      </div>
      <div>
        <Button onClick={clearFilter} variant={"outline"} className="w-full">
          Clear Filter
        </Button>
      </div>
    </aside>
  );
};

export default FilterProducts;
