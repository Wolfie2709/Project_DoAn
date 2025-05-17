import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { productsData } from "@/data/products/productsData";
import { Product } from "@/types";

import React from "react";
import SingleProductCartView from "../product/SingleProductCartView";


const mapToProduct = (item: any): Product => {
  return {
    productId: item.id,
    productName: item.name,
    description: item.description,
    shortDescription: item.aboutItem?.join(", "),
    stock: item.stockItems,
    price: item.price,
    brandID: mapBrandToID(item.brand),
    categoryID: mapCategoryToID(item.category),
    discountedPrice: item.price - (item.price * item.discount) / 100,
    images: item.images.map((img: string, index: number) => ({
      id: index,
      url: img,
    })),
  };
};

// Giả sử bạn có các hàm này
const mapBrandToID = (brandName: string): number => {
  const brandMap: Record<string, number> = {
    Nike: 1,
    Adidas: 2,
    Puma: 3,
  };
  return brandMap[brandName] || 0;
};

const mapCategoryToID = (categoryName: string): number => {
  const categoryMap: Record<string, number> = {
    Shoes: 1,
    Clothes: 2,
    Accessories: 3,
  };
  return categoryMap[categoryName] || 0;
};


const ProductsCollectionTwo = () => {
  //get products data from server here based on the category or tab value
  const data = productsData;

  // return (
  //   <section className="max-w-screen-xl mx-auto py-16 px-4 md:px-8 w-full">
  //     <Tabs defaultValue="new-arrivals" className="w-full space-y-8 mx-0">
  //       <TabsList className="font-semibold bg-transparent w-full text-center">
  //         <TabsTrigger value="new-arrivals" className="md:text-xl">
  //           New Arrivals
  //         </TabsTrigger>
  //         <TabsTrigger value="best-sellers" className="md:text-xl">
  //           Best Sellers
  //         </TabsTrigger>
  //         <TabsTrigger value="feauted" className="md:text-xl">
  //           Featured
  //         </TabsTrigger>
  //       </TabsList>
  //       <TabsContent value="new-arrivals" className="w-full">
  //         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
  //           {data?.slice(0, 8)?.map((item) => {
  //             const product = mapToProduct(item);
  //             return (
  //               <SingleProductCartView key={product.productId} product={product} />
  //             );
  //           })}
  //         </div>
  //       </TabsContent>
  //       <TabsContent value="best-sellers">
  //         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
  //           {data?.slice(0, 8)?.map((product) => {
  //             return (
  //               <SingleProductCartView key={product.id} product={product} />
  //             );
  //           })}
  //         </div>
  //       </TabsContent>
  //       <TabsContent value="feauted">
  //         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
  //           {data?.slice(0, 8)?.map((product) => {
  //             return (
  //               <SingleProductCartView key={product.id} product={product} />
  //             );
  //           })}
  //         </div>
  //       </TabsContent>
  //     </Tabs>
  //   </section>
  // );
};

export default ProductsCollectionTwo;
