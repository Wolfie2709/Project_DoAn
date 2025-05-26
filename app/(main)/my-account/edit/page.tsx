'use client'

import React, { useEffect, useState } from "react";
import EditCustomerForm from "@/components/forms/EditCustomerForm";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { CustomerFormData } from "@/components/forms/EditCustomerForm";

function mapCustomerToFormData(customer: any): CustomerFormData {
  return {
    fullName: customer?.fullName ?? "",
    birthday: customer?.birthday ?? "",
    email: customer?.email ?? "",
    gender: ["Male", "Female", "Others"].includes(customer?.gender) ? customer.gender : "Others",
    address: customer?.address ?? "",
    phoneNumber: customer?.phoneNumber ?? "",
  };
}

export default function EditPage() {
  const router = useRouter();
  const { customer, setCustomer } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // If customer missing, fetch from backend by id saved in some auth token or localStorage
  // (You may need to adapt this logic to how you handle auth tokens)
  useEffect(() => {
    if (!customer) {
      setLoading(true);
      // Example: fetch logged-in user data from backend with stored token or ID
      fetch("https://localhost:7240/api/Customers/me", { credentials: "include" })
        .then(res => res.json())
        .then(data => {
          setCustomer(data);
        })
        .catch(() => {
          // redirect to login or show message
          router.push("/login");
        })
        .finally(() => setLoading(false));
    }
  }, [customer, setCustomer, router]);

  if (loading) return <div>Loading...</div>;

  if (!customer) return <div>Please log in</div>;

  const handleEditSubmit = async (data: CustomerFormData) => {
    const updatedCustomer = { ...customer, ...data };
  
    const res = await fetch(`https://localhost:7240/api/Customers/${customer.customerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCustomer),
    });
  
    if (res.ok) {
      // Try parse JSON safely
      const text = await res.text();
      if (text) {
        const updated = JSON.parse(text);
        setCustomer(updated);
      } else {
        // If no JSON returned, fallback to updatedCustomer from local
        setCustomer(updatedCustomer);
      }
      router.push("/my-account");
    } else {
      console.error("Failed to update");
    }
  };

  return (
    <EditCustomerForm
      customer={mapCustomerToFormData(customer)}
      onSubmitEdit={handleEditSubmit}
    />
  );
}
