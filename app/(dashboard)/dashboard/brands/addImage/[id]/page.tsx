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
  const [file, setFile] = useState<File | null>(null);
  const [mainImage, setMainImage] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Vui lòng chọn ảnh");
      return;
    }

    if (!response?.accessToken) {
      alert("Không có token");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("brandId", id as string);
    formData.append("mainImage", mainImage ? "true" : "false");

    try {
      const res = await fetch("https://localhost:7240/api/Images/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      alert("Upload thành công!");
      router.push("/dashboard/brands");
    } catch (err) {
      console.error(err);
      alert("Lỗi upload ảnh");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen max-w-screen-xl w-full mx-auto px-4 py-12 m-2 rounded-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Thêm ảnh cho Brand</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-white">
            Chọn ảnh
          </Label>
          <Input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="mainImage"
            checked={mainImage}
            onChange={(e) => setMainImage(e.target.checked)}
          />
          <label htmlFor="mainImage" className="text-gray-700 dark:text-white">
            Là ảnh chính
          </label>
        </div>
        <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Tải lên
        </Button>
      </form>
    </div>
  );
}
