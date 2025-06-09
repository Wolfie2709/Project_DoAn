"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(1),
  price: z.string().min(1),
  category: z.string().min(1),
  brand: z.string().min(1),
  type: z.enum(["featured", "top-rated", "most-popular", "new-arrivals"]),
  description: z.string(),
  aboutItem: z.string().optional(),
  discount: z.coerce.number().optional(),
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

  const onSubmit = async (data: FormData) => {
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
      discount: data.discount || 0,
    };

    try {
      const res = await fetch(`https://localhost:7240/api/Products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update");

      alert("✅ Product updated!");
    } catch (err) {
      alert("❌ Error updating product");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("name")} placeholder="Name" />
      {errors.name && <p>{errors.name.message}</p>}

      <input {...register("price")} placeholder="Price" />
      {errors.price && <p>{errors.price.message}</p>}

      <input {...register("category")} placeholder="Category" />
      {errors.category && <p>{errors.category.message}</p>}

      <input {...register("brand")} placeholder="Brand" />
      {errors.brand && <p>{errors.brand.message}</p>}

      <select {...register("type")}>
        <option value="featured">Featured</option>
        <option value="top-rated">Top Rated</option>
        <option value="most-popular">Most Popular</option>
        <option value="new-arrivals">New Arrivals</option>
      </select>

      <textarea {...register("description")} placeholder="Description" />
      <textarea {...register("aboutItem")} placeholder="About Item" />

      <input type="number" {...register("discount")} placeholder="Discount" />

      <button type="submit" disabled={isSubmitting}>
        Update
      </button>
    </form>
  );
};

export default EditProductForm;
