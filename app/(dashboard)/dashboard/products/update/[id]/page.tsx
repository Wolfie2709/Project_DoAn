"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EditProductForm from "@/components/forms/EditProductForm";

type ProductData = {
  name: string;
  price: string;
  category: string;
  brand: string;
  type: "featured" | "top-rated" | "most-popular" | "new-arrivals";
  description: string;
  aboutItem?: string;
  discount?: number;
};

const EditProductPage = () => {
  const params = useParams();

  const rawId = typeof params === "object" && "id" in params ? params.id : "";
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`https://localhost:7240/api/Products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();

        setProduct({
          name: data.productName || "",
          price: data.price?.toString() || "",
          category: data.category?.name || "",
          brand: data.brand?.name || "",
          type: "featured", // or derive from data if available
          description: data.description || "",
          aboutItem: data.shortDescription || "",
          discount: data.discount || 0,
        });

        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <EditProductForm id={id} initialData={product} />
    </div>
  );
};

export default EditProductPage;
