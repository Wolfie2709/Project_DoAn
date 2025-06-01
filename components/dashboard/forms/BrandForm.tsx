'use client'
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { Response } from "@/types"

// Define the schema for form validation
// Define the schema for form validation
const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  image: z.string().url({ message: "Invalid URL format" }),
  description: z.string().min(1, "Description is required"),
});

// Define TypeScript types for form data
type FormData = z.infer<typeof formSchema>;

const AddBrandForm: React.FC = () => {
  const [response, setResponse] = useState<Response>();
  // Initialize react-hook-form
    const router = useRouter();

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  //Ham lay get response
  const getResponse = () => {
    try {
      //lay value tu session storage
      const storedData = sessionStorage.getItem("food-storage");
      if (storedData == null) {
        throw new Error("Ban chua dang nhap")
      }

      //lay ra noi dung ben trong storedData
      const parsed = JSON.parse(storedData);
      if (parsed == null) {
        throw new Error("Ban chua dang nhap: loi o parsed")
      }

      //Lay ra response
      const responseData = parsed.state;
      if (responseData == null) {
        throw new Error("Ban chua dang nhap: loi o response")
      }

      if (responseData.employee == null) {
        throw new Error("Ban khong phai la employee")
      }
      setResponse(responseData);
    } catch (error) {
      alert(error);
      router.push("/dashboard")
    }
  }

  // useEffect để lấy response từ session
  useEffect(() => {
    getResponse();
  }, []);

  useEffect(() => {
    if (!response || !response.accessToken) return;

    //prevent clerk from access update view
    try {
      if (response.employee?.position != "Manager") {
        throw new Error("Ban khong co quyen truy cap")
      }
    } catch (error) {
      alert(error)
      router.push("/dashboard/brands")
    }
  }, [response])

  // Form submission handler
  const onSubmit = async (data: FormData) => {
    if (!response || !response.accessToken) return;
    var whichEmployee = response.employee?.employeeId;
    try {
      const response = await fetch("https://localhost:7240/api/Brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandName: data.name,
          // Các field còn lại nếu bạn có thêm: parentCategoryId, addedBy, ...
          addedBy: whichEmployee,
          // images: [
          //   {
          //     imageUrl: data.image, // cần map đúng với class Image bên C#
          //   }
          // ],
          // Nếu muốn thêm mô tả, bạn cần cập nhật model để hỗ trợ description
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create brand");
      }

      const result = await response.json();
      console.log("Brand created successfully:", result);
      // Có thể reset form hoặc chuyển hướng ở đây
      router.push("/dashboard/brands");
    } catch (error) {
      console.error("Error submitting Brand:", error);
    }
  };

  return (
      <div className="max-w-screen-xl w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Add Brand
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Brand Name
            </Label>
            <Input
              type="text"
              id="name"
              {...register("name")}
              className={`mt-1 p-2 w-full rounded-md border ${
                errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name.message}</span>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Description
            </Label>
            <textarea
              id="description"
              {...register("description")}
              className={`mt-1 p-2 w-full bg-white dark:bg-slate-950 rounded-md  border ${
                errors.description ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } focus:ring-blue-500 focus:border-blue-500`}
            ></textarea>
            {errors.description && (
              <span className="text-red-500 text-sm">{errors.description.message}</span>
            )}
          </div>
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Add Brand
          </Button>
        </form>
      </div>
    );
};

export default AddBrandForm;
