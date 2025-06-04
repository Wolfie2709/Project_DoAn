"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const employeeSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  position: z.enum(["Admin", "Manager", "Employee"]),
  birthday: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  email: z.string().email("Invalid email"),
  gender: z.enum(["male", "female", "others"]),
  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  doj: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  EUsername: z.string().min(4, "Username must be at least 4 characters"),
  EPasswordHash: z.string().min(6, "Password must be at least 6 characters"),
});

export type EmployeeFormData = z.infer<typeof employeeSchema> & { id?: number };

type EditEmployeeFormProps = {
  employee: EmployeeFormData;
  onSubmitEdit: (data: EmployeeFormData) => void;
};

const EditEmployeeForm: React.FC<EditEmployeeFormProps> = ({ employee, onSubmitEdit }) => {
  const [response, setResponse] = useState<any>(null);
  const router = useRouter();

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

  // Fetch session and validate access
  const getResponse = () => {
    try {
      const storedData = sessionStorage.getItem("food-storage");
      if (!storedData) throw new Error("Bạn chưa đăng nhập");

      const parsed = JSON.parse(storedData);
      if (!parsed?.state?.employee) throw new Error("Bạn không phải là employee");

      setResponse(parsed.state);
    } catch (error) {
      alert(error);
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    getResponse();
  }, []);

  useEffect(() => {
  if (!response?.accessToken) return;
  try {
    const isSelfOrManagerOrAdmin =
      response?.employee?.position === "Admin" ||
      response?.employee?.position === "Manager" ||
      response?.employee?.employeeId === employee.id;

    if (!isSelfOrManagerOrAdmin) {
      throw new Error("Bạn không có quyền truy cập");
    }
  } catch (error) {
    alert(error);
    router.push("/dashboard/employees");
  }
}, [response, employee]);

  const onSubmit = (data: EmployeeFormData) => {
    if (!response?.accessToken) return;

    const updatedEmployee = {
      ...data,
      id: employee.id,
      editedBy: response.employee?.employeeId, // optional: who edited
    };
    onSubmitEdit(updatedEmployee);
  };

  return (
    <div className="max-w-screen-xl mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Edit Employee
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div>
            <Label htmlFor="EUsername" className="block text-sm font-medium text-gray-700 dark:text-white">
              Username
            </Label>
            <Input
              id="EUsername"
              type="text"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              {...register("EUsername")}
            />
            {errors.EUsername && <span className="text-red-500">{errors.EUsername.message}</span>}
          </div>

          <div>
            <Label htmlFor="EPasswordHash" className="block text-sm font-medium text-gray-700 dark:text-white">
              Password
            </Label>
            <Input
              id="EPasswordHash"
              type="password"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              {...register("EPasswordHash")}
            />
            {errors.EPasswordHash && <span className="text-red-500">{errors.EPasswordHash.message}</span>}
          </div>
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Employee Name
            </Label>
            <Input
              id="fullName"
              type="text"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              {...register("fullName")}
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
              type="date"
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
              type="email"
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
            <Input
              id="doj"
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
            <Input
              id="phonenumber"
              type ="tel"
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