// pages/(dashboard)/dashboard/products/add/page.tsx

import ProductForm from "@/components/dashboard/forms/ProductForm";
import BreadcrumbComponent from "@/components/others/Breadcrumb";
import React from "react";

const AddProductPage = () => {
  return (
    <div className="p-2 w-full">
      <BreadcrumbComponent links={["/dashboard", "/products"]} pageText="Add Product" />
      <ProductForm />
    </div>
  );
};

export default AddProductPage;
