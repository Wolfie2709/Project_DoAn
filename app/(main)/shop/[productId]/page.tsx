"use client";

import ProductGallery from "@/components/product/ProductGallery";
import { productsData } from "@/data/products/productsData";
import React, { useEffect, useState } from "react";
import RelatedProducts from "@/components/products/RelatedProducts";
import BreadcrumbComponent from "@/components/others/Breadcrumb";
import ProductDetails from "@/components/product/ProductDetails";
import { Product } from "@/types";

// Define the props interface for the component
interface ProductIdPageProps {
  params: { productId: string };
}

// Define the main component
const ProductIdPage = ({ params }: ProductIdPageProps) => {
 const [product, setProduct] = useState<Product>();
  // TODO: fetch product data with the productId
  const fetchData = async () => {
    try {
      const res = await fetch(`https://localhost:7240/api/Products/${Number(params.productId)}`);
      const data: Product = await res.json();
      setProduct(data);

    } catch (error) {
      console.error("Failed to fetch products", error);
    } 
  };
  
  // Find the product with the specified ID from the products data
  

  // Filter related products based on the category of the current product
  // const relatedProducts = productsData.filter(
  //   (prod) => prod.category === product?.category
  // );

  // Return the JSX structure of the component
  useEffect(() => {
    fetchData();
    
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto p-4 md:p-8 flex flex-col items-start gap-2 min-h-screen">
      {/* Breadcrumb Component */}
      <div className="my-2">
        <BreadcrumbComponent links={["/shop"]} pageText={product?.productName!} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        {/* Product Gallery */}
        <ProductGallery isInModal={false} images={product?.images?.map(image => image.imageUrl)} />
        {/* product details */}
        <ProductDetails product={product!}/>
      </div>
      {/* Related Products */}
      {/* <RelatedProducts products={relatedProducts} /> */}
    </div>
  );
};

// Export the component as default
export default ProductIdPage;
