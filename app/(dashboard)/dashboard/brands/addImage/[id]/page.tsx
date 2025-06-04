'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import React from 'react';
import { useEffect, useState } from "react";
import { Response } from "@/types"

const schema = z.object({
  imageUrl: z.string().url({ message: 'Image URL is not valid' }),
});

type FormData = z.infer<typeof schema>;

export default function AddImagePage() {
  const [response, setResponse] = useState<Response>();
  const { id } = useParams(); // brandId từ URL
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
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

  const onSubmit = async (data: FormData) => {
    if (!response?.accessToken) throw new Error("Không có token đăng nhập");
    if (response.employee?.position != "Manager") {
      alert("Ban khong co quyen truy cap");
      throw new Error("Position khong hop le");
    }

    try {
      const fetchResponse = await fetch('https://localhost:7240/api/Images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${response.accessToken}`, // Thêm Authorization header
        },
        body: JSON.stringify({
          imageUrl: data.imageUrl,
          brandId: parseInt(id as string),
          mainImage: true, // tùy chọn
        }),
      });

      if (!fetchResponse.ok) {
        throw new Error('Failed to add image');
      }

      alert('Image added successfully!');
      router.push('/dashboard/brands');
    } catch (error) {
      console.error('Error adding image:', error);
      alert('Error adding image');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen max-w-screen-xl w-full mx-auto px-4 py-12 m-2 rounded-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Add Image</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-white">
            Image URL
          </Label>
          <Input
            type="text"
            id="imageUrl"
            {...register('imageUrl')}
            className={`mt-1 w-full p-2 border ${errors.imageUrl ? 'border-red-500' : 'border-gray-300'
              } rounded-md`}
          />
          {errors.imageUrl && <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>}
        </div>
        <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Add Image
        </Button>
      </form>
    </div>
  );
}
