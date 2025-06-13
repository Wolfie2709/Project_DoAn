'use client'
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const schema = z.object({
  firstName: z.string().min(3, "First Name is required"),
  lastName: z.string().min(1),
  home_address: z.string().min(5, "Address is required"),
  phone: z.string().min(8, "Phone is required"),
  city: z.string().min(3, "City is required"),
  zip: z.string().min(5, "ZIP Code is required"),
  country: z.string().min(2, "Country is required"),
  email: z.string().min(5, "Email is required"),
});

type CheckoutFormData = z.infer<typeof schema>;

type CheckoutFormProps = {
  onSubmitForm: (data: CheckoutFormData) => void;
};

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmitForm }) => {
  const { customer } = useAuthStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullCustomerDetails = async () => {
      if (!customer?.customerId) return;

      try {
        const res = await fetch(`https://localhost:7240/api/Customers/${customer.customerId}`);
        if (!res.ok) throw new Error("Failed to fetch customer details");

        const fullCustomer = await res.json();

        const fullName = fullCustomer.fullName?.split(" ") || [];
        const firstName = fullName[0] || "";
        const lastName = fullName.slice(1).join(" ") || "";

        const address = fullCustomer.address?.split(",") || [];
        const home_address = address[0] || "";
        const city = address[1] || "";
        const zip = address[2] || "";
        const country = address[3] || "";

        // Set form values
        setValue("firstName", firstName);
        setValue("lastName", lastName);
        setValue("home_address", home_address);
        setValue("city", city);
        setValue("zip", zip);
        setValue("country", country);
        setValue("phone", fullCustomer.phoneNumber || "");
        setValue("email", fullCustomer.email || "");
      } catch (err) {
        console.error("Error fetching customer:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFullCustomerDetails();
  }, [customer, setValue]);

  const onSubmit: SubmitHandler<CheckoutFormData> = (data) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("shippingFormData", JSON.stringify(data));
    }
    alert("Shipping info saved.");
  };

  if (loading) return <p>Loading...</p>; // Optional: show a loader

  return (
    <form id="CheckoutForm" onSubmit={handleSubmit((data) => onSubmitForm(data))} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" {...register("firstName")} />
          {errors.firstName && <span className="text-red-500">{errors.firstName.message}</span>}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" {...register("lastName")} />
          {errors.lastName && <span className="text-red-500">{errors.lastName.message}</span>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" {...register("email")} />
          {errors.email && <span className="text-red-500">{errors.email.message}</span>}
        </div>
      </div>
      <div>
        <Label htmlFor="home_address">Home Address</Label>
        <Input id="home_address" {...register("home_address")} />
        {errors.home_address && <span className="text-red-500">{errors.home_address.message}</span>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input type="tel" id="phone" {...register("phone")} />
          {errors.phone && <span className="text-red-500">{errors.phone.message}</span>}
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city")} />
          {errors.city && <span className="text-red-500">{errors.city.message}</span>}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="zip">ZIP Code</Label>
          <Input id="zip" {...register("zip")} />
          {errors.zip && <span className="text-red-500">{errors.zip.message}</span>}
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" {...register("country")} />
          {errors.country && <span className="text-red-500">{errors.country.message}</span>}
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default CheckoutForm;
