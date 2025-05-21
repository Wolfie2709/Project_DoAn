// change or modify the types as your requirement

export type Product = {
  productId: number;
  productName?: string;
  description?: string;
  stock: number;
  price: number;
  brandID: number;
  categoryID: number;
  shortDescription?: string;
  brand?: Brand;
  category?: Category;
  images: Image[];
  discountedPrice: number;
};

export type Brand={
brandId: number;
brandName: string;
products: Product;
}

export type Image={
  imageID : number;
  productID : number;
  mainImage? : boolean;
  imageUrl: string;
  product: Product;
}

export type Category={
categoryId: number;
categoryName: string;
parentCategoryID: number;
inverseParentCategory: Category;
products: Product;
images: Image[];
}

export type OrderDetails={
orderDetailID: number;
orderID?: number;
productID: number;
amount: number;
discount: number;
order: Order;
product: Product;
}

export type Employee={
employeeId: number;
addedBy: number;
position: string;
doj?: string;
fullName?: string;
phoneNumber?: string;
email?: string;
birthday?: string;  
gender?: string;
address?: string;
lastLogin: string;
}

export type Order={
  orderId: number;
  userId?: number;
  shippingAddress?: string;
  orderDate?: string;
  status?: string;
  estimatedDate?: string;
  totalCost?: number;
  receiverEmail?: string;
  receiverName?: string;
  receiverPhoneNumber?: string;
  note?: string;
  orderDetails: OrderDetail[];
  payments: Payment[];
  user?: User;
}

export type OrderDetail={
  orderDetailId: number;
  orderId?: number;
  productId?: number;
  amount?: number;
  discount?: number;
  order?: Order;
  product?: Product;
}

export type Payment={
  paymentId: number;
  orderId?: number;
  paymentMethod?: string;
  transactionId?: string;
  status?: string;
  order?: Order;
}

export type User={
  userId: number;
  phoneNumber?: string;
  fullName?: string;
  email?: string;
  birthday?: string;
  gender?: string;
  address?: string;
  orders: Order[];
  reviews: Review[];
  shoppingCarts: ShoppingCart[];
}

export type Review = {
  author: string;
  image: string;
  content: string;
  rating:number
  date: Date;
};

export type ShoppingCart={
  userId: number;
  productId: number;
  amount?: number;
  product: Product;
  user: User;
}

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
