'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CheckoutForm from "@/components/forms/CheckoutForm";
import OrderSummaryForCheckout from "@/components/carts/OrderSummaryForCheckout";
import CouponCodeForm from "@/components/forms/CouponCodeForm";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import useCartStore from "@/store/cartStore";

const CheckoutPageOne = () => {
  const router = useRouter();
  const { customer } = useAuthStore();
  const { getTotalAmount, cartItems } = useCartStore();

  const [formData, setFormData] = useState(null);

  const handleFormSubmit = (data: any) => {
    setFormData(data); // Save to local state
    localStorage.setItem("shippingFormData", JSON.stringify(data));
  };

  const handlePlaceOrderClick = () => {
    if (!formData) {
      alert("Please fill in your shipping information first.");
      return;
    }
    router.push("/complete-checkout");
  };

  return (
    <section className="px-4 py-4 lg:px-16 bg-white dark:bg-gray-800">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Checkout
          </h1>
          <p>Please fill out the address form if you haven't saved it.</p>
          <Separator className="dark:bg-white/50 mt-2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Shipping Address
              </h2>
              <CheckoutForm onSubmitForm={handleFormSubmit} />
            </div>
            <CouponCodeForm />
          </div>
          <OrderSummaryForCheckout />
        </div>
        <Button
          onClick={handlePlaceOrderClick}
          className="text-xl mt-6 bg-blue-500 dark:bg-blue-600 text-white py-6 px-12 hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none rounded-full hover:ring-2"
        >
          Place Order
        </Button>
      </div>
    </section>
  );
};

export default CheckoutPageOne;
