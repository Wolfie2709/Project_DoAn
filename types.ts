export type Product = {
  productId: number;
  productName: string;
  description: string;
  stock: number;
  price: number;
  brandID: number;
  categoryID: number;
  shortDescription?: string;
  brand?: Brand;
  category?: Category;
  images: Image[];
  discountedPrice: number;
  wishlistId: number;
  activeStatus: boolean;
};

export type Brand = {
  brandId: number;
  brandName: string;
  description: string;
  images: Image[];
  products: Product;
  activeStatus: boolean;
}

export type Image = {
  imageID: number;
  productID: number;
  mainImage?: boolean;
  imageUrl: string;
  product: Product;
}

export type Category = {
  categoryId: number;
  categoryName: string;
  parentCategoryID: number | null;
  inverseParentCategory: Category;
  description: string;
  products: Product;
  images: Image[];
  activeStatus: boolean;
}

export type OrderDetails = {
  orderDetailID: number;
  orderID?: number;
  productID: number;
  amount: number;
  discount: number;
  order: Order;
  product: Product;
}

export type Employee = {
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
  isDeletedStatus?: boolean;
}

export type Order = {
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
  customer: Customer;
}

export type OrderDetail = {
  orderDetailId: number;
  orderId?: number;
  productId?: number;
  amount?: number;
  discount?: number;
  order?: Order;
  product?: Product;
}

export type Payment = {
  paymentId: number;
  orderId?: number;
  paymentMethod?: string;
  transactionId?: string;
  status?: string;
  order?: Order;
}

export type Customer = {
  customerId: number;
  phoneNumber?: string;
  fullName?: string;
  email?: string;
  birthday?: string;
  gender?: string;
  address?: string;
  userName?: string;
  password?: string;
  orders: Order[];
  reviews: Review[];
  shoppingCarts: ShoppingCart[];
  isDeletedStatus?: boolean;
  lastLogin: string;
}

export type Review = {
  author: string;
  image: string;
  content: string;
  rating: number
  date: Date;
};

export type ShoppingCart = {
  userId: number;
  productId: number;
  amount?: number;
  product: Product;
  customer: Customer;
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

export type CustomerSessionDto = {
  customerId: number;
  fullName?: string;
  userName?: string;
}

export type EmployeeSessionDto = {
  employeeId: number;
  position: string;
  fullName?: string;
}

export type Response = {
  userName?: string;
  accessToken?: string;
  customer?: CustomerSessionDto;
  employee?: EmployeeSessionDto;
}

export type OrderedProductDto = {
  orderDetailId: number;
  orderId: number;
  productName?: string;
  imageUrl?: string;
  price: number;
  amount?: number;
  originalPrice?: number;
  discountAmount?: number;
  finalPrice?: number;
}

export type OrderDashboardDto = {
  orderId: number;
  customerName: string;
  orderDate?: string;
  estimatedDate?: string;
  orderStatus?: string;
  shippingAddress?: string;
  receiverName?: string;
  receiverNumber?: string;
  note?: string;
  totalPrice?: number;
  orderedProducts: OrderedProductDto[];
}

export type OrderChartDto = {
  orderDetailId: number;
  orderId?: number;
  productId: number;
  amount?: number;
  brandId?: number;
  categoryId?: number;
}

export type OrderHomeDto = {
  orderId: number;
  customerName: string;
  orderDate?: string;
  estimatedDate?: string;
  orderStatus?: string;
  totalCost?: number;
  orderCharts: OrderChartDto[];
}

export type ChildCategoryDto = {
  categoryId: number;
  categoryName?: string;
}

export type CategoryParentListDto = {
  categoryId: number;
  categoryName?: string;
  children: ChildCategoryDto[];
}

export type ImageAddDto = {
  productId?: number;
  brandId?: number;
  categoryId?: number;
  mainImage?: boolean;
}