"use client";
import React, { useEffect, useState } from "react";
import CartItemsDetails from "../carts/CartItemsDetails";
import { Separator } from "../ui/separator";
import useCartStore from "@/store/cartStore";
import { Button } from "../ui/button";
import { formatPrice } from "@/lib/formatPrice";
import { useAuthStore } from "@/store/authStore";
import { Label } from "../ui/label";

const FinalConfirmationForm = () => {
  const [shippingData, setShippingData] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { getTotalPrice, getTax, getShippingFee, getTotalAmount, cartItems, clearCart } = useCartStore();
  const { customer, customerDetails, setCustomerDetails } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  
    const initialize = async () => {
      const fetchCustomerDetails = async () => {
        if (customer) {
          try {
            const res = await fetch(`https://localhost:7240/api/Customers/${customer.customerId}`);
            if (!res.ok) throw new Error("Failed to fetch customer details");
            const data = await res.json();
  
            console.log("📦 API response data:", data);
  
            setCustomerDetails({
              email: data.email ?? "",
              phone: data.phoneNumber ?? "",
              address: data.address ?? "",
            });
          } catch (err) {
            console.error("Error fetching customer details:", err);
          }
        }
      };
  
      await fetchCustomerDetails();
  
      const storedData = localStorage.getItem("shippingFormData");
      const parsedData = storedData ? JSON.parse(storedData) : null;
  
      if (parsedData) {
        const latest = useAuthStore.getState().customerDetails;
        if (latest) {
          parsedData.email = latest.email || parsedData.email;
          parsedData.phone = latest.phone || parsedData.phone;
          parsedData.address = latest.address || parsedData.address;
        }
  
        console.log("✅ Final merged shippingData:", parsedData);
        setShippingData(parsedData);
      }
    };
  
    initialize(); // ✅ Run async logic inside this function
  }, [customer]);
  
  

  const handleFormSubmit = async () => {
    if (!shippingData || !customer || !paymentMethod || cartItems.length === 0) {
      alert("Please make sure all information is filled and cart is not empty.");
      return;
    }

    const order = {
      CustomerId: customer.customerId,
      Address: `${shippingData?.home_address ?? ""}, ${shippingData?.city ?? ""}, ${shippingData?.zip ?? ""}, ${shippingData?.country ?? ""}`,
      EstimateDate: new Date().toISOString(),
      Note: shippingData?.note ?? "",
      ReceiverName: `${shippingData?.firstName ?? ""} ${shippingData?.lastName ?? ""}`,
      ReceiverPhone: shippingData?.phone ?? "",
      ReceiverEmail: shippingData?.email ?? "",
      productList: cartItems.map((item: any) => ({
        ProductId: item.productId,
        Amount: item.quantity,
        OriginalPrice: item.price,
        DiscountedPrice: item.discountedPrice ?? item.price,
      })),
    };
    

    try {
      setIsSubmitting(true);

      const res = await fetch("https://localhost:7240/api/Orders", {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const contentType = res.headers.get("Content-Type");
        let errorText = "Unknown error";

        if (contentType?.includes("application/json")) {
          const errorData = await res.json();
          errorText = errorData.message || JSON.stringify(errorData);
        } else {
          errorText = await res.text();
        }

        console.error("Order API validation error:", errorText);
        alert(`Failed to place order: ${errorText}`);
        return;
      }

      alert("Order placed successfully!");
      localStorage.removeItem("shippingFormData");
      clearCart?.(); // optional if your cartStore supports this

    } catch (err) {
      console.error(err);
      alert("Failed to place order: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isMounted) {
    // avoid hydration mismatch, or show loader
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
      {/* Personal Info */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <p className="text-gray-800 dark:text-white">{shippingData?.firstName} {shippingData?.lastName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <p className="text-gray-800 dark:text-white">{shippingData?.Email}</p>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Address</h2>
        <p className="text-gray-800 dark:text-white">{shippingData?.home_address}, {shippingData?.city}, {shippingData?.zip}, {shippingData?.country}</p>
        <p className="text-gray-800 dark:text-white">Phone: {shippingData?.phoneNumber}</p>
      </div>

      {/* Order Items */}
      <div>
        <h2 className="text-lg font-semibold my-2 lg:p-4">Order Items</h2>
        <CartItemsDetails />
        <Separator className="dark:bg-white/50 mb-2" />
      </div>

      {/* Order Summary */}
      <div className="lg:px-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
        <div className="flex justify-between mb-4">
          <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
          <span className="text-gray-900 dark:text-white">${formatPrice(getTotalPrice())}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-700 dark:text-gray-300">Shipping:</span>
          <span className="text-gray-900 dark:text-white">${formatPrice(getShippingFee())}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-700 dark:text-gray-300">Tax:</span>
          <span className="text-gray-900 dark:text-white">${formatPrice(getTax())}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xl font-semibold text-gray-900 dark:text-white">Total:</span>
          <span className="text-xl font-semibold text-gray-900 dark:text-white">${formatPrice(getTotalAmount())}</span>
        </div>

        {/* Payment Method */}
        <div className="mt-4">
          <Label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-white">
            Payment Method
          </Label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-1 p-2 block w-full dark:bg-slate-950 rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select Payment Method --</option>
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="cash_on_delivery">Cash on Delivery</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>

        <Button
          onClick={handleFormSubmit}
          disabled={isSubmitting}
          className={`text-xl mt-6 py-6 px-12 rounded-full focus:outline-none hover:ring-2 
            ${isSubmitting ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed" : "bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white"}`}
        >
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </Button>

      </div>
    </div>
  );
};

export default FinalConfirmationForm;
