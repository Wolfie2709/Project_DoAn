"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Brand = {
  brandId: number;
  brandName: string;
};

type Category = {
  categoryId: number;
  categoryName: string;
};

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().min(1, "Price is required"),
  stock: z.number().min(0, "Stock must be at least 0"),
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
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

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
      stock: 0,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandRes, categoryRes] = await Promise.all([
          fetch("https://localhost:7240/api/Brands"),
          fetch("https://localhost:7240/api/Categories"),
        ]);

        const brandData = await brandRes.json();
        const categoryData = await categoryRes.json();

        setBrands(Array.isArray(brandData) ? brandData : []);
        setCategories(Array.isArray(categoryData) ? categoryData : []);
      } catch (error) {
        console.error("❌ Lỗi khi fetch brand/category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: ProductFormData) => {
    try {
      const payload = {
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

      const res = await fetch("https://localhost:7240/api/Products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error("❌ Failed to add product: " + errorText);
      }

      const result = await res.json();
      alert("✅ Product added successfully!");
      onAdd?.();
      reset();

      router.push("/dashboard/products");
    } catch (error) {
      console.error("🚨 Error creating product", error);
      alert("❌ Error creating product");
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Product</h2>
        <Button variant="outline" onClick={() => router.push("/dashboard/products")}>
          Return
        </Button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>
      ) : (
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
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" type="number" {...register("stock", { valueAsNumber: true })} />
            {errors.stock && <span className="text-red-500">{errors.stock.message}</span>}
          </div>

          <div>
            <Label htmlFor="discount">Discount (%)</Label>
            <Input id="discount" type="number" {...register("discount", { valueAsNumber: true })} />
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
      )}
    </div>
  );
};

export default ProductForm;
