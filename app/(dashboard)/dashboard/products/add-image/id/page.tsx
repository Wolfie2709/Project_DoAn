'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import React from 'react';

const schema = z.object({
  imageUrl: z.string().url({ message: 'Image URL is not valid' }),
});

type FormData = z.infer<typeof schema>;

export default function AddProductImagePage() {
  const { id } = useParams(); // productId từ URL
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('https://localhost:7240/api/Images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: data.imageUrl,
          productId: parseInt(id as string),
          mainImage: true, // có thể tùy chỉnh nếu cần
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add product image');
      }

      alert('Product image added successfully!');
      router.push('/dashboard/products');
    } catch (error) {
      console.error('Error adding product image:', error);
      alert('Error adding product image');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen max-w-screen-xl w-full mx-auto px-4 py-12 m-2 rounded-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Add Product Image</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-white">
            Image URL
          </Label>
          <Input
            type="text"
            id="imageUrl"
            {...register('imageUrl')}
            className={`mt-1 w-full p-2 border ${errors.imageUrl ? 'border-red-500' : 'border-gray-300'} rounded-md`}
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
