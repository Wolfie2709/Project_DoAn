"use client";
import React, { useState } from "react";
import { optional, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const employeeSchema = z.object({
  image: z
    .any()
    .refine((file) => file instanceof File, "Image is required"),
  name: z.string().min(1, "Name is required"),
  position: z.enum(["Admin", "Manager", "Employee"]),
  birthday: z.string().min(1, "Birthday is required"),
  email: z.string().min(1, "Email is required"),
  gender: z.string().min(1, "Gender is required"),
  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  doj: z.string().min(1, "Doj is required"),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

const EmployeeForm = () => {
  const [preview, setPreview] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  const onSubmit = (data: EmployeeFormData) => {
    console.log(data);
    // Reset preview and form here if needed
    setPreview(null);
  };

  return (
    <div className="max-w-screen-xl mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Add New Employee
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* ✅ Image Upload Input */}
        <div>
          <Label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Employee Image
          </Label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setValue("image", file); // register file with RHF
                setPreview(URL.createObjectURL(file)); // set preview
              }
            }}
            className="mt-1 p-2 block w-full text-gray-800 dark:text-white bg-white dark:bg-slate-950 rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.image && (
            <span className="text-red-500">{errors.image.message}</span>
          )}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded-md border"
            />
          )}
        </div>
        <div>
          <Label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Employee Name
          </Label>
          <Input
            id="name"
            type="text"
            className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            {...register("name")}
          />
          {errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
          )}
        </div>

         <div>
          <Label
            htmlFor="position"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Position
          </Label>
          <select
            id="position"
            className="mt-1 p-2 block w-full dark:bg-slate-950 rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            {...register("position")}
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
          </select>
          {errors.position && (
            <span className="text-red-500">{errors.position.message}</span>
          )}
        </div>

        <div>
          <Label
            htmlFor="birthday"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Birthday
          </Label>
          <Input
            id="birthday"
            type="string"
            className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            {...register("birthday")}
          />
          {errors.birthday && (
            <span className="text-red-500">{errors.birthday.message}</span>
          )}
        </div>
        <div>
          <Label
            htmlFor="Email"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Email
          </Label>
          <Input
            id="email"
            type="text"
            className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </div>

        <div>
          <Label
            htmlFor="Gender"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Gender
          </Label>
          <select
            id="gender"
            className="mt-1 p-2 block w-full dark:bg-slate-950 rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            {...register("gender")}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
          {errors.gender && (
            <span className="text-red-500">{errors.gender.message}</span>
          )}
        </div>

        <div>
          <Label
            htmlFor="Address"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Address
          </Label>
          <textarea
            id="address"
            className="mt-1 p-2 block border bg-white dark:bg-slate-950 rounded-md w-full  border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            {...register("address")}
          />
          {errors.address && (
            <span className="text-red-500">{errors.address.message}</span>
          )}
        </div>

        <div>
          <Label
            htmlFor="Doj"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Date of joining
          </Label>
          <textarea
            id=""
            className="mt-1 p-2 block border bg-white dark:bg-slate-950 rounded-md w-full  border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            {...register("doj")}
          />
          {errors.doj && (
            <span className="text-red-500">{errors.doj.message}</span>
          )}
        </div>
        <div>
          <Label
            htmlFor="Phonenumber"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Phone number
          </Label>
          <textarea
            id=""
            className="mt-1 p-2 block border bg-white dark:bg-slate-950 rounded-md w-full  border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <span className="text-red-500">{errors.phoneNumber.message}</span>
          )}
        </div>
        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Add Employee
        </Button>
      </form>
    </div>
  );
};

export default EmployeeForm;
