'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  description: z.string().min(1, 'Description is required'),
});

type FormData = z.infer<typeof formSchema>;

export default function UpdateBrandPage() {
  const { id } = useParams();
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageId, setImageId] = useState<number | null>(null);
  // const [token, setToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  function getAccessTokenFromSession(): string | null {
    const storedData = sessionStorage.getItem("food-storage");
    if (!storedData) return null;

    try {
      const parsed = JSON.parse(storedData);
      return parsed.state?.accessToken ?? null;
    } catch (error) {
      console.error("Failed to parse session data:", error);
      return null;
    }
  }
  
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const tokenFromSession = getAccessTokenFromSession();
        if(tokenFromSession == null){
          // Cần chỉnh lấy role manager
          alert("Khong phai la manager")
          router.push('/dashboard/brands')
        }
        const res = await fetch(`https://localhost:7240/api/Brands/${id}`, {
          headers: {
            'Authorization': `Bearer ${tokenFromSession}` //Thêm Authorization header
          }
        });
        const data = await res.json();

        setValue('name', data.brandName || '');
        setValue('description', data.description || '');

        if (data.images != null) {
          setImageUrl(data.images[0].imageUrl);
          setImageId(data.images[0].imageId); // Gán imageId
        }
        // console.log(data.images)
      } catch (error) {
        console.error('Failed to fetch brand:', error);
      }
    };

    fetchBrand();
  }, [id, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const tokenFromSession = getAccessTokenFromSession();

      const response = await fetch(`https://localhost:7240/api/Brands/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenFromSession}`, // Thêm Authorization header
        },
        body: JSON.stringify({
          brandId: Number(id),
          brandName: data.name,
          description: data.description,
        }),
      });

      if (!response.ok) throw new Error('Failed to update brand');
      router.push('/dashboard/brands');
    } catch (error) {
      console.error('Error updating brand:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen max-w-screen-xl w-full mx-auto px-4 py-12 m-2 rounded-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Update Brand</h2>

      {imageUrl && (
        <div
          className="mb-6 cursor-pointer"
          onClick={() => router.push(`/dashboard/brands/updateImage/${imageId}`)}
        >
          <img
            src={imageUrl}
            alt="Brand Image"
            className="w-full h-64 object-contain border rounded hover:opacity-75"
          />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Brand Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            {...register('description')}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-700"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update
        </Button>
      </form>
    </div>
  );
}
