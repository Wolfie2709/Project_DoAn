'use client'
import CheckoutForm from "@/components/forms/CheckoutForm";
import OrderSummaryForCheckout from "@/components/carts/OrderSummaryForCheckout";
import CouponCodeForm from "@/components/forms/CouponCodeForm";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { useAuthStore } from "@/store/authStore";
import useCartStore from "@/store/cartStore";

const CheckoutPageOne = () => {
  const { customer } = useAuthStore();
  const { getTotalAmount, cartItems } = useCartStore();

  const handleFormSubmit = async (data: any) => {
    if (!customer) return;

    const order = {
      customerId: customer.customerId,
      shippingAddress: `${data.home_address}, ${data.city}, ${data.zip}, ${data.country}`,
      phone: data.phone,
      paymentMethod: "Cash",
      orderDate: new Date().toISOString(),
    };

    const orderDetails = cartItems.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    try {
      const res = await fetch("https://localhost:7240/api/Orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!res.ok) throw new Error("Order creation failed");
      const createdOrder = await res.json();

      // Create order details
      await Promise.all(orderDetails.map(detail =>
        fetch("https://localhost:7240/api/OrderDetails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...detail, orderId: createdOrder.orderId }),
        })
      ));

      alert("Order placed successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };
  return (
    <section className="px-4 py-4 lg:px-16  bg-white dark:bg-gray-800">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white ">
            Checkout
          </h1>
          <p>Please fill out the address form if you haven&apos;t save it</p>
          <Separator className="dark:bg-white/50 mt-2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Address */}
          <div>
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Shipping Address
              </h2>
              <CheckoutForm onSubmitForm={(data) => {
                  // handle the submitted form data
                  console.log("Form submitted:", data);
                }} />
            </div>
              <CouponCodeForm />
          </div>
          {/* Order Summary */}
          <OrderSummaryForCheckout />
        </div>
      </div>
    </section>
  );
};

export default CheckoutPageOne;
