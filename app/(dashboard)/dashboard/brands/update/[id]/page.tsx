'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Response } from "@/types"

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
  const [response, setResponse] = useState<Response>();

  const {
    register,
    handleSubmit,
    setValue,
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

  useEffect(() =>{
    if (!response || !response.accessToken) return;

    //prevent clerk from access update view
    try{
      if (response.employee?.position != "Manager") {
        throw new Error("Ban khong co quyen truy cap")
      }
    }catch(error){
      alert(error)
      router.push("/dashboard/brands")
    }
  }, [response])

  
  //Lay ra brand theo id
  useEffect(() => {
    if(!response || !response.accessToken) return;
    const fetchBrand = async () => {
      try {
        // console.log(response.accessToken)
        const res = await fetch(`https://localhost:7240/api/Brands/${id}`, {
          headers: {
            'Authorization': `Bearer ${response?.accessToken}` //Thêm Authorization header
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
  }, [response, id, setValue]);

  //Ham cap nhat khi nhan nut
  const onSubmit = async (data: FormData) => {
    try {
      if (!response?.accessToken) throw new Error("Không có token đăng nhập");
      if(response.employee?.position != "Manager"){
        alert("Ban khong co quyen truy cap");
        throw new Error("Position khong hop le");
      }

      console.log(response.accessToken, response.employee.position)
      const responsePut = await fetch(`https://localhost:7240/api/Brands/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${response.accessToken}`, // Thêm Authorization header
        },
        body: JSON.stringify({
          brandId: Number(id),
          brandName: data.name,
          description: data.description,
        }),
      });

      if (!responsePut.ok) throw new Error('Failed to update brand');
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
