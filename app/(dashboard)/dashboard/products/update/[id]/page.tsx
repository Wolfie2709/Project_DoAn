"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EditProductForm from "@/components/forms/EditProductForm";
import { Response } from "@/types";

const EditProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const rawId = typeof params === "object" && "id" in params ? params.id : "";
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductWithAuth = async () => {
      try {
        // Lấy session
        const stored = sessionStorage.getItem("food-storage");
        if (!stored) throw new Error("Bạn chưa đăng nhập");

        const parsed = JSON.parse(stored);
        const state: Response = parsed?.state;
        if (!state?.accessToken) throw new Error("Token không hợp lệ");
        if (state.employee?.position !== "Manager") throw new Error("Bạn không có quyền truy cập");

        // Lấy sản phẩm
        const res = await fetch(`https://localhost:7240/api/Products/${id}`, {
          headers: {
            Authorization: `Bearer ${state.accessToken}`,
          },
        });

        if (!res.ok) throw new Error("Không thể tải sản phẩm");
        const data = await res.json();

        setProduct({
          name: data.productName,
          price: data.price?.toString() || "",
          category: data.category?.name || "",
          brand: data.brand?.name || "",
          type: "featured",
          description: data.description || "",
          aboutItem: data.shortDescription || "",
          discount: data.discount || 0,
        });

        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
        setTimeout(() => router.push("/dashboard/products"), 2000);
      }
    };

    if (id) fetchProductWithAuth();
  }, [id, router]);

  if (loading) return <div className="p-4 text-gray-500">⏳ Đang tải sản phẩm...</div>;
  if (error) return <div className="p-4 text-red-500">❌ {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-4">🛠️ Edit Product</h1>
      {product && <EditProductForm id={id} initialData={product} />}
    </div>
  );
};

export default EditProductPage;



