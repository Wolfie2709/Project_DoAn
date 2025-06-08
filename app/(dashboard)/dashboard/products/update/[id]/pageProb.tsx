import ProductForm from "@/components/dashboard/forms/ProductForm";
import { Product } from "@/types";
import { Metadata } from "next";

type EditProductPageProps = {
  params: {
    id: string;
  };
};

export const metadata: Metadata = {
  title: "Edit Product",
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = params;

  let product: Product | null = null;

  try {
    const res = await fetch(`https://localhost:7240/api/Products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch product");
    }

    product = await res.json();
  } catch (error) {
    console.error("❌ Error fetching product:", error);
  }

  return (
    <div className="container py-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <ProductForm
        mode="edit"
        initialData={product}
      />
    </div>
  );
}
