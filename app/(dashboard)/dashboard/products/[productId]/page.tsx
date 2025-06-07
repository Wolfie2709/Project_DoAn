import React from "react";
import ProductGallery from "@/components/product/ProductGallery";
import ProductDetails from "@/components/product/ProductDetails";
import BreadcrumbComponent from "@/components/others/Breadcrumb";
import { notFound } from "next/navigation";

// 🔁 Tạm dùng mock data
import { productsData } from "@/data/products/productsData";

const ProductDetailsPage = ({ params }: { params: { id: string } }) => {
  const productId = parseInt(params.id);
  const product = productsData.find((p) => p.productId === productId);

  if (!product) return notFound();

  return (
    <div className="max-w-screen-xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="py-2">
        <BreadcrumbComponent
          links={["/dashboard", "/products"]}
          pageText={product.name}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:gap-8">
        <ProductGallery isInModal={false} images={product.images} />
        <ProductDetails product={product} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
