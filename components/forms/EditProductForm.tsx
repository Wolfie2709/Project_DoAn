"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().min(1, "Price is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  type: z.enum(["featured", "top-rated", "most-popular", "new-arrivals"]),
  description: z.string().min(1, "Description is required"),
  aboutItem: z.string().optional(),
  discount: z.coerce.number().min(0).max(100).optional(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  id: string;
  initialData: FormData;
};

const EditProductForm: React.FC<Props> = ({ id, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [position, setPosition] = useState<string | null>(null);

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

  const onSubmit = async (data: FormData) => {
    if (!accessToken || position !== "Manager") {
      alert("Bạn không có quyền cập nhật sản phẩm.");
      return;
    }

    const payload = {
      productName: data.name,
      stock: 10,
      price: parseFloat(data.price),
      description: data.description,
      shortDescription: data.aboutItem || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      brandId: 1, // giả lập, cần thay bằng brand thực tế
      categoryId: 1, // giả lập, cần thay bằng category thực tế
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

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      alert("✅ Product updated!");
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("❌ Error updating product");
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 my-10">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Product</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" {...register("name")} className="h-12 text-base" />
          {errors.name && <span className="text-red-500">{errors.name.message}</span>}
        </div>

        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" {...register("price")} className="h-12 text-base" />
          {errors.price && <span className="text-red-500">{errors.price.message}</span>}
        </div>

        <div>
          <Label htmlFor="discount">Discount (%)</Label>
          <Input id="discount" type="number" {...register("discount")} className="h-12 text-base" />
          {errors.discount && <span className="text-red-500">{errors.discount.message}</span>}
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" {...register("category")} className="h-12 text-base" />
          {errors.category && <span className="text-red-500">{errors.category.message}</span>}
        </div>

        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" {...register("brand")} className="h-12 text-base" />
          {errors.brand && <span className="text-red-500">{errors.brand.message}</span>}
        </div>

        <div>
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            {...register("type")}
            className="h-12 text-base border rounded-md w-full bg-white dark:bg-gray-900"
          >
            <option value="featured">Featured</option>
            <option value="top-rated">Top Rated</option>
            <option value="most-popular">Most Popular</option>
            <option value="new-arrivals">New Arrivals</option>
          </select>
          {errors.type && <span className="text-red-500">{errors.type.message}</span>}
        </div>

        <div className="col-span-full">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            {...register("description")}
            className="p-3 w-full rounded-md border h-32 text-base"
          />
          {errors.description && <span className="text-red-500">{errors.description.message}</span>}
        </div>

        <div className="col-span-full">
          <Label htmlFor="aboutItem">About Item</Label>
          <textarea
            id="aboutItem"
            {...register("aboutItem")}
            className="p-3 w-full rounded-md border h-24 text-base"
          />
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

export default EditProductForm;
