// change or modify the types as your requirement

export type Product = {
  productId: number;
  productName?: string;
  description?: string;
  stock: number;
  price: number;
  
};

export type Review = {
  author: string;
  image: string;
  content: string;
  rating:number
  date: Date;
};

export type SearchParams = {
  page: string;
  category: string;
  brand: string;
  search: string;
  min: string;
  max: string;
  color: string;
};

export type CartItem = Product & {
  selectedColor: string;
  quantity: number;
};
