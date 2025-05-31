"use client";
import React, { useEffect, useState } from "react";
import CartItemsDetails from "../carts/CartItemsDetails";
import { Separator } from "../ui/separator";
import useCartStore from "@/store/cartStore";
import { Button } from "../ui/button";
import Loader from "../others/Loader";
import { formatPrice } from "@/lib/formatPrice";
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Label } from "../ui/label";


const FinalConfirmationForm = () => {
  const [isMounted, setIsMounted] = useState(false);
  const customer = useAuthStore((state) => state.customer);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { getTotalPrice, getTax, getShippingFee, getTotalAmount } =
    useCartStore();

  if (!isMounted) {
    return <Loader />;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
      {/* ordered items details */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <p className="text-gray-800 dark:text-white">{customer?.fullName}</p>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <p className="text-gray-800 dark:text-white">{customer?.email}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <div className='flex items-center justify-between'>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Address</h2>
          </div>
          <div>
            <p className="text-gray-800 dark:text-white">{customer?.address}</p>
          </div>
        </div>
        
      <div>
        <h2 className="text-lg font-semibold my-2 lg:p-4">Order Items</h2>
        <CartItemsDetails />
        <Separator className="dark:bg-white/50 mb-2" />
      </div>

      {/* order summary for order place */}
      <div className="lg:px-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Order Summary
        </h2>
        <div className="flex justify-between mb-4">
          <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
          <span className="text-gray-900 dark:text-white">
            ${formatPrice(getTotalPrice())}
          </span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-700 dark:text-gray-300">Shipping:</span>
          <span className="text-gray-900 dark:text-white">
            ${formatPrice(getShippingFee())}
          </span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-700 dark:text-gray-300">Tax:</span>
          <span className="text-gray-900 dark:text-white">
            ${formatPrice(getTax())}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            Total:
          </span>
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            ${formatPrice(getTotalAmount())}
          </span>
        </div>
        <div className="mt-4">
        <Label
            htmlFor="paymentMethod"
            className="block text-sm font-medium text-gray-700 dark:text-white"
        >
            Payment Method
        </Label>
        <select
            id="paymentMethod"
            className="mt-1 p-2 block w-full dark:bg-slate-950 rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
        >
            <option value="">-- Select Payment Method --</option>
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="cash_on_delivery">Cash on Delivery</option>
            <option value="bank_transfer">Bank Transfer</option>
        </select>
        </div>
        <Button>

        </Button>
      </div>
    </div>
  );
};

export default FinalConfirmationForm;
