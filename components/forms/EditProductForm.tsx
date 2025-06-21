"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().min(1, "Price is required"),
  stock: z.number().min(0, "Stock must be at least 0"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  type: z.enum(["featured", "top-rated", "most-popular", "new-arrivals"]),
  description: z.string().min(1, "Description is required"),
  aboutItem: z.string().optional(),
  discount: z.coerce.number().min(0).max(100).optional(),
});

type FormData = z.infer<typeof schema>;
type Brand = { brandId: number; brandName: string };
type Category = { categoryId: number; categoryName: string };

const EditProductPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [position, setPosition] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [initialData, setInitialData] = useState<FormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("food-storage");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      const state = parsed?.state;
      if (state?.accessToken) {
        setAccessToken(state.accessToken);
        setPosition(state.employee?.position || null);
      }
    } catch (error) {
      console.error("Error parsing session storage:", error);
    }
  }, []);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [brandRes, categoryRes] = await Promise.all([
          fetch("https://localhost:7240/api/Brands"),
          fetch("https://localhost:7240/api/Categories"),
        ]);
        setBrands(await brandRes.json());
        setCategories(await categoryRes.json());
      } catch (error) {
        console.error("Failed to fetch brand/category", error);
      }
    };
    fetchMeta();
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://localhost:7240/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();

        const mapped: FormData = {
          name: data.productName,
          price: data.price.toString(),
          stock: data.stock || 0,
          description: data.description,
          category: data.categoryId?.toString() || "",
          brand: data.brandId?.toString() || "",
          type: data.type || "featured",
          aboutItem: data.shortDescription || "",
          discount: data.discount || 0,
        };

        setInitialData(mapped);
        reset(mapped);
      } catch (err) {
        console.error("❌", err);
        alert("Lỗi khi lấy thông tin sản phẩm");
      }
    };
    fetchProduct();
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    if (!accessToken || position !== "Manager") {
      alert("Bạn không có quyền cập nhật sản phẩm.");
      return;
    }

    const payload = {
      productId: Number(id),
      productName: data.name,
      stock: data.stock,
      price: parseFloat(data.price),
      description: data.description,
      shortDescription: data.aboutItem || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      brandId: parseInt(data.brand),
      categoryId: parseInt(data.category),
      addedBy: null,
      discount: data.discount || 0,
    };

    try {
      const res = await fetch(`https://localhost:7240/api/Products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed");

      alert("✅ Product updated!");
      router.push("/dashboard/products");
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("❌ Error updating product");
    }
  };

  if (!initialData) return <div className="text-center py-10">⏳ Đang tải dữ liệu sản phẩm...</div>;

  return (
    <div className="w-full max-w-screen-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 my-10">
      <div className="mb-6">
        <Link
          href="/dashboard/products"
          className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition"
        >
          ← Return
        </Link>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Product</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <span className="text-red-500">{errors.name.message}</span>}
        </div>

        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" {...register("price")} />
          {errors.price && <span className="text-red-500">{errors.price.message}</span>}
        </div>

        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" {...register("stock", { valueAsNumber: true })} />
          {errors.stock && <span className="text-red-500">{errors.stock.message}</span>}
        </div>

        <div>
          <Label htmlFor="discount">Discount (%)</Label>
          <Input id="discount" type="number" {...register("discount")} />
          {errors.discount && <span className="text-red-500">{errors.discount.message}</span>}
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <select id="category" {...register("category")} className="p-2 w-full border rounded-md bg-white dark:bg-gray-900">
            <option value="">-- Select Category --</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
            ))}
          </select>
          {errors.category && <span className="text-red-500">{errors.category.message}</span>}
        </div>

        <div>
          <Label htmlFor="brand">Brand</Label>
          <select id="brand" {...register("brand")} className="p-2 w-full border rounded-md bg-white dark:bg-gray-900">
            <option value="">-- Select Brand --</option>
            {brands.map((b) => (
              <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
            ))}
          </select>
          {errors.brand && <span className="text-red-500">{errors.brand.message}</span>}
        </div>

        <div>
          <Label htmlFor="type">Type</Label>
          <select id="type" {...register("type")} className="p-2 w-full border rounded-md bg-white dark:bg-gray-900">
            <option value="featured">Featured</option>
            <option value="top-rated">Top Rated</option>
            <option value="most-popular">Most Popular</option>
            <option value="new-arrivals">New Arrivals</option>
          </select>
          {errors.type && <span className="text-red-500">{errors.type.message}</span>}
        </div>

        <div className="col-span-full">
          <Label htmlFor="description">Description</Label>
          <textarea id="description" {...register("description")} className="p-3 w-full rounded-md border h-32" />
          {errors.description && <span className="text-red-500">{errors.description.message}</span>}
        </div>

        <div className="col-span-full">
          <Label htmlFor="aboutItem">About Item</Label>
          <textarea id="aboutItem" {...register("aboutItem")} className="p-3 w-full rounded-md border h-24" />
        </div>

        <div className="col-span-full">
          <Button type="submit" disabled={isSubmitting || !accessToken} className="w-full h-12 text-lg">
            {isSubmitting ? "Updating..." : "Update Product"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
