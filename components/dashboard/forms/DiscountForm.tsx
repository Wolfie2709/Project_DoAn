'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

import { Product, Response } from '@/types';

const formSchema = z.object({
  eventName: z.string().min(1, 'Event name is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  productId: z.string().min(1, 'Product selection is required'),
  discount: z.string().min(1, 'Discount is required'),
});

type FormData = z.infer<typeof formSchema>;

const DiscountForm = () => {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Load token / session
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('food-storage');
      if (!stored) throw new Error('Not logged in');
      const parsed = JSON.parse(stored);
      setResponse(parsed.state);
    } catch {
      alert('Please login again.');
      router.push('/dashboard');
    }
  }, [router]);

  // Load products
  useEffect(() => {
    fetch('https://localhost:7240/api/Products')
      .then((res) => {
        if (!res.ok) throw new Error('Network response not OK');
        return res.json();
      })
      .then((data: Product[]) => setProducts(data))
      .catch((err) => console.error('Failed to fetch products:', err));
  }, []);

  const onSubmit = async (data: FormData) => {
    if (loading || !response?.accessToken) return;
    setLoading(true);

    const payload = {
      eventName: data.eventName.trim(),
      description: data.description.trim(),
      eventDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      productId: Number(data.productId),
      discount: parseFloat(data.discount),
      addedBy: Number(response.employee?.employeeId ?? 0), // 👈 Phải là int
    };

    try {
      const res = await fetch('https://localhost:7240/api/Discounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${response.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Discount added successfully');
        reset(); // reset form
        router.push('/dashboard/discounts');
      } else {
        const errText = await res.text();
        console.error('Add discount failed:', errText);
        alert('Failed to add discount: ' + errText);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-xl w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Add Discount
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Event Name */}
        <div className="space-y-2">
          <Label htmlFor="eventName">Event Name</Label>
          <Input id="eventName" {...register('eventName')} className={errors.eventName ? 'border-red-500' : ''} />
          {errors.eventName && <span className="text-sm text-red-500">{errors.eventName.message}</span>}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" {...register('description')} className={errors.description ? 'border-red-500' : ''} />
          {errors.description && <span className="text-sm text-red-500">{errors.description.message}</span>}
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input type="datetime-local" id="startDate" {...register('startDate')} className={errors.startDate ? 'border-red-500' : ''} />
          {errors.startDate && <span className="text-sm text-red-500">{errors.startDate.message}</span>}
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input type="datetime-local" id="endDate" {...register('endDate')} className={errors.endDate ? 'border-red-500' : ''} />
          {errors.endDate && <span className="text-sm text-red-500">{errors.endDate.message}</span>}
        </div>

        {/* Discount */}
        <div className="space-y-2">
          <Label htmlFor="discount">Discount (%)</Label>
          <Input type="number" id="discount" step="0.01" {...register('discount')} className={errors.discount ? 'border-red-500' : ''} />
          {errors.discount && <span className="text-sm text-red-500">{errors.discount.message}</span>}
        </div>

        {/* Product Select */}
        <div className="space-y-2">
          <Label>Product</Label>
          <Select onValueChange={(val) => setValue('productId', val)}>
            <SelectTrigger className={errors.productId ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.productId} value={p.productId.toString()}>
                  {p.productName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.productId && <span className="text-sm text-red-500">{errors.productId.message}</span>}
        </div>

        {/* Submit */}
        <div className="lg:col-span-2 text-right">
          <Button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white">
            {loading ? 'Adding...' : 'Add Discount'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DiscountForm;
