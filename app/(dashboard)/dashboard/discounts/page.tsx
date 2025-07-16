'use client';

import React, { useEffect, useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type Discount = {
  discountId: number;
  eventName: string;
  description: string;
  eventDate: string;
  endDate: string | null;
  createdAt: string;
  addedBy: string | number;
  activeStatus?: boolean;
};

type ProductWithDiscount = {
  productId: number;
  productName: string;
  price: number;
  discountPercent: number;
  finalPrice: number;
  eventName: string;
  eventDate: string;
  endDate: string;
};

type Response = {
  accessToken: string;
  employee: {
    position: string;
  };
};

const DiscountsPage = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [productsWithDiscount, setProductsWithDiscount] = useState<ProductWithDiscount[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [response, setResponse] = useState<Response>();
  const router = useRouter();

  useEffect(() => {
    const getResponse = () => {
      try {
        const stored = sessionStorage.getItem('food-storage');
        if (!stored) throw new Error('You are not logged in.');

        const parsed = JSON.parse(stored);
        const state = parsed?.state;
        if (!state?.accessToken || !state?.employee)
          throw new Error('Invalid login information.');

        setResponse(state);
      } catch (error: any) {
        alert(error.message || 'Authentication error');
        router.push('/dashboard');
      }
    };

    getResponse();
  }, [router]);

  useEffect(() => {
    if (!response?.accessToken) return;

    const fetchDiscounts = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://localhost:7240/api/Discounts', {
          headers: {
            Authorization: `Bearer ${response.accessToken}`,
          },
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        const filtered = data.filter((d: Discount) => d?.activeStatus !== false);
        setDiscounts(filtered);
      } catch (err: any) {
        alert(err.message || 'Failed to fetch discounts');
        setDiscounts([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchProductsWithDiscount = async () => {
      try {
        const res = await fetch('https://localhost:7240/api/Discounts/with-products', {
          headers: {
            Authorization: `Bearer ${response.accessToken}`,
          },
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        setProductsWithDiscount(data);
      } catch (err: any) {
        console.error('Failed to fetch discounted products:', err);
        setProductsWithDiscount([]);
      }
    };

    fetchDiscounts();
    fetchProductsWithDiscount();
  }, [response]);

  const softDeleteDiscount = async (id: number) => {
    if (!response?.accessToken) return alert('Missing access token');
    if (!['Manager', 'Admin'].includes(response.employee.position))
      return alert('You are not authorized to soft delete.');

    const confirmed = confirm('Are you sure you want to hide this discount?');
    if (!confirmed) return;

    try {
      const res = await fetch(`https://localhost:7240/api/Discounts/softdelete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${response.accessToken}`,
        },
      });

      if (!res.ok) throw new Error(await res.text());

      setDiscounts(prev => prev.filter(d => d.discountId !== id));
      alert('Discount successfully hidden.');
    } catch (error: any) {
      alert('Failed to hide discount: ' + error.message);
    }
  };

  const openModal = (discount: Discount) => {
    setSelectedDiscount(discount);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDiscount(null);
    setIsModalOpen(false);
  };

  const getProductsForDiscount = (discountId: number) =>
    productsWithDiscount.filter(p => p.eventName === selectedDiscount?.eventName);

  return (
    <div className="max-w-screen-xl mx-auto w-full bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 my-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🎉 Discounts</h2>
        <div className="flex gap-3">
          <Link
            href="/dashboard/discounts/add"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            + Add Discount
          </Link>
          <Link
            href="/dashboard/discounts/discount-trashbin"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition"
          >
            <Trash2 size={18} />
            Trash
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading discounts...</p>
      ) : discounts.length === 0 ? (
        <p className="text-center text-gray-500">No active discounts.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border dark:border-gray-700">
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Event Name</th>
                <th className="px-4 py-3">Start Date</th>
                <th className="px-4 py-3">End Date</th>
                <th className="px-4 py-3">Added By</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {discounts.map(discount => (
                <tr key={discount.discountId} className="bg-white dark:bg-gray-800">
                  <td className="px-4 py-3">{discount.eventName}</td>
                  <td className="px-4 py-3">{new Date(discount.eventDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{discount.endDate ? new Date(discount.endDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-4 py-3">{discount.addedBy ?? 'Unknown'}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openModal(discount)}>
                      <Eye size={16} className="mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => softDeleteDiscount(discount.discountId)}>
                      <Trash2 size={16} className="mr-1" />
                      Hide
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL HIỂN THỊ CHI TIẾT DISCOUNT + SẢN PHẨM */}
      {isModalOpen && selectedDiscount && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl shadow-lg relative overflow-y-auto max-h-[80vh]">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Discount Details</h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200 mb-4">
              <p><strong>ID:</strong> {selectedDiscount.discountId}</p>
              <p><strong>Event Name:</strong> {selectedDiscount.eventName}</p>
              <p><strong>Description:</strong> {selectedDiscount.description}</p>
              <p><strong>Start Date:</strong> {new Date(selectedDiscount.eventDate).toLocaleString()}</p>
              <p><strong>End Date:</strong> {selectedDiscount.endDate ? new Date(selectedDiscount.endDate).toLocaleString() : 'N/A'}</p>
              <p><strong>Added By:</strong> {selectedDiscount.addedBy}</p>
              <p><strong>Created At:</strong> {new Date(selectedDiscount.createdAt).toLocaleString()}</p>
            </div>

            {/* SẢN PHẨM GIẢM GIÁ */}
            <h4 className="text-md font-semibold text-gray-800 dark:text-white mt-4 mb-2">
              📦 Products in this Discount
            </h4>
            <table className="min-w-full text-sm border dark:border-gray-600">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
                <tr>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Original Price</th>
                  <th className="px-4 py-2">Discount</th>
                  <th className="px-4 py-2">Final Price</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {getProductsForDiscount(selectedDiscount.discountId).map(p => (
                  <tr key={p.productId} className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-2">{p.productName}</td>
                    <td className="px-4 py-2 text-gray-500 line-through">
                      {p.price.toLocaleString('vi-VN')}₫
                    </td>
                    <td className="px-4 py-2">{p.discountPercent}%</td>
                    <td className="px-4 py-2 font-semibold text-green-600">
                      {p.finalPrice.toLocaleString('vi-VN')}₫
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 text-right">
              <Button onClick={closeModal}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountsPage;
