"use client";
import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Form validation schema
const employeeSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  position: z.enum(["Admin", "Manager", "Employee"]),
  birthday: z.string().min(1, "Birthday is required"),
  email: z.string().min(1, "Email is required"),
  gender: z.enum(["Male", "Female", "Others"]),
  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  doj: z.string().min(1, "Date of joining is required"),
});

export type EmployeeFormData = z.infer<typeof employeeSchema> & { id?: number };

type EditEmployeeFormProps = {
  employee: EmployeeFormData;
  onSubmitEdit: (data: EmployeeFormData) => void;
};

const EditEmployeeForm: React.FC<EditEmployeeFormProps> = ({ employee, onSubmitEdit }) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee,
  });

  useEffect(() => {
    reset(employee);
  }, [employee, reset]);

  const onSubmit = (data: EmployeeFormData) => {
  const updatedEmployee = { ...data, id: employee.id };
  onSubmitEdit(updatedEmployee);
};

  return (
    <div className="max-w-screen-xl mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Edit Employee
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
            {...register("fullName")}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          />
            {errors.fullName && (
              <span className="text-red-500">{errors.fullName.message}</span>
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
            <option value="">Select position</option>
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
            htmlFor="email"
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
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Gender
          </Label>
          <select
            id="gender"
            className="mt-1 p-2 block w-full dark:bg-slate-950 rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            {...register("gender")}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>
          {errors.gender && (
            <span className="text-red-500">{errors.gender.message}</span>
          )}
        </div>

        <div>
          <Label
            htmlFor="address"
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
            htmlFor="doj"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Date of joining
          </Label>
          <Input
            id="doj"
            type="text"
            className="mt-1 p-2 block border bg-white dark:bg-slate-950 rounded-md w-full  border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            {...register("doj")}
          />
          {errors.doj && (
            <span className="text-red-500">{errors.doj.message}</span>
          )}
        </div>
        <div>
          <Label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Phone number
          </Label>
          <Input
            id="phoneNumber"
            type="text"
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
            Save Changes
        </Button>
      </form>
    </div>
  );
};

export default EditEmployeeForm;