// pages/dashboard/products/edit/[id].tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ProductForm from "@/components/dashboard/forms/ProductForm";

const EditProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`https://localhost:7240/api/Products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch(console.error);
  }, [id]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      {product ? (
        <ProductForm product={product} mode="edit" />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditProductPage;
