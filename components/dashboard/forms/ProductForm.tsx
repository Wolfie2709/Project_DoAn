"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Schema validation
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().min(1, "Price is required"),
  category: z.string().min(1, "Category is required"), // dùng để hiển thị thôi
  brand: z.string().min(1, "Brand is required"),
  type: z.enum(["featured", "top-rated", "most-popular", "new-arrivals"]),
  description: z.string().min(1, "Description is required"),
  aboutItem: z.string().optional(),
  images: z.array(z.instanceof(File)).min(1, "At least one image is required"),
  color: z.array(z.string()).optional(),
  discount: z.number().min(0).max(100).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductForm = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductFormData) => {
  const formData = new FormData();
  formData.append("productName", data.name);
  formData.append("price", data.price);
  formData.append("description", data.description);
  formData.append("shortDescription", data.aboutItem ?? "");
  formData.append("brandId", "1"); // 👈 Update theo brand thật
  formData.append("categoryId", "1"); // 👈 Update theo category thật
  formData.append("stock", "10"); // 👈 Giả sử

  for (let image of data.images) {
    formData.append("images", image);
  }

  try {
    const res = await fetch("https://localhost:7240/api/Products", {
      method: "POST",
      body: JSON.stringify({
        productName: data.name,
        price: parseFloat(data.price),
        description: data.description,
        shortDescription: data.aboutItem ?? "",
        brandId: 1,
        categoryId: 1,
        stock: 10,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to create product");

    alert("Product added!");
  } catch (err) {
    console.error(err);
    alert("Failed to add product");
  }
};


  return (
    <div className="max-w-screen-xl mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Product</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" type="text" {...register("name")} />
          {errors.name && <span className="text-red-500">{errors.name.message}</span>}
        </div>

        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="text" {...register("price")} />
          {errors.price && <span className="text-red-500">{errors.price.message}</span>}
        </div>

        <div>
          <Label htmlFor="discount">Discount (%)</Label>
          <Input id="discount" type="number" {...register("discount", { valueAsNumber: true })} />
          {errors.discount && <span className="text-red-500">{errors.discount.message}</span>}
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" type="text" {...register("category")} />
          {errors.category && <span className="text-red-500">{errors.category.message}</span>}
        </div>

        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" type="text" {...register("brand")} />
          {errors.brand && <span className="text-red-500">{errors.brand.message}</span>}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea id="description" {...register("description")} className="p-2 w-full rounded-md border" />
          {errors.description && <span className="text-red-500">{errors.description.message}</span>}
        </div>

        <div>
          <Label htmlFor="aboutItem">About Item</Label>
          <textarea id="aboutItem" {...register("aboutItem")} className="p-2 w-full rounded-md border" />
        </div>

        <div>
          <Label htmlFor="images">Images</Label>
          <Input id="images" type="file" multiple {...register("images")} />
          {errors.images && <span className="text-red-500">{errors.images.message}</span>}
        </div>

        <div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
