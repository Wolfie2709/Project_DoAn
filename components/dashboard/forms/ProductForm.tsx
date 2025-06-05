"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().min(1, "Price is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  type: z.enum(["featured", "top-rated", "most-popular", "new-arrivals"]),
  description: z.string().min(1, "Description is required"),
  aboutItem: z.string().optional(),
  images: z.array(z.instanceof(File)).optional(),
  color: z.array(z.string()).optional(),
  discount: z.number().min(0).max(100).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

type ProductFormProps = {
  onAdd?: () => void;
};

const ProductForm: React.FC<ProductFormProps> = ({ onAdd }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: "",
      category: "",
      brand: "",
      type: "featured",
      description: "",
      aboutItem: "",
      images: [],
      color: [],
      discount: undefined,
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      const payload = {
        productName: data.name,
        stock: 10,
        price: parseFloat(data.price),
        description: data.description,
        shortDescription: data.aboutItem || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        brandId: 1,
        categoryId: 1,
        addedBy: null,
      };

      console.log("🚀 Payload gửi đi:", payload);

      const res = await fetch("https://localhost:7240/api/Products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ API error:", errorText);
        throw new Error("Failed to add product");
      }

      const result = await res.json();
      console.log("✅ Product created:", result);
      alert("Product added successfully!");
      onAdd?.(); // gọi callback cập nhật danh sách
      reset();   // reset form sau khi thêm
    } catch (error) {
      console.error("🚨 Error creating product", error);
      alert("Error creating product");
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
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            {...register("type")}
            className="p-2 w-full border rounded-md bg-white dark:bg-gray-900"
          >
            <option value="featured">Featured</option>
            <option value="top-rated">Top Rated</option>
            <option value="most-popular">Most Popular</option>
            <option value="new-arrivals">New Arrivals</option>
          </select>
          {errors.type && <span className="text-red-500">{errors.type.message}</span>}
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
          <Label htmlFor="images">Images (optional)</Label>
          <Input id="images" type="file" multiple {...register("images")} />
          {errors.images && <span className="text-red-500">{errors.images.message}</span>}
        </div>

        <div className="col-span-full">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

