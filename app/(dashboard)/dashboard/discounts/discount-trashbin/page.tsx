'use client';

import React, { useEffect, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import Loader from '@/components/others/Loader';
import Pagination from '@/components/others/Pagination';

type Discount = {
  discountId: number;
  eventName: string;
  description: string;
  eventDate: string;
  endDate: string;
  addedBy: string;
  createdAt: string;
  isDeleted?: boolean;
};

type Response = {
  accessToken: string;
  employee: {
    position: string;
  };
};

const DiscountTrashbinPage = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("discountpage") || "1", 10);
  const itemsPerPage = 6;

  const paginatedDiscounts = discounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('food-storage');
      if (!stored) throw new Error('Bạn chưa đăng nhập');
      const parsed = JSON.parse(stored)?.state;
      if (!parsed?.employee) throw new Error('Không có quyền truy cập');
      setResponse(parsed);
    } catch (err) {
      alert((err as Error).message);
      router.push('/dashboard');
    }
  }, []);

  const fetchDeletedDiscounts = async () => {
    if (!response?.accessToken) return;
    try {
      setLoading(true);
      const res = await fetch('https://localhost:7240/api/Discounts/deleted', {
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
      });

      if (!res.ok) {
        console.error("❌ Fetch failed:", res.status, res.statusText);
        setDiscounts([]);
        return;
      }

      const data = await res.json();
      console.log("📥 Fetched deleted discounts:", data);

      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu trả về không phải dạng mảng.");
      }

      setDiscounts(data);
    } catch (err) {
      console.error('❌ Lỗi khi lấy danh sách discount đã xoá:', err);
      setDiscounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (response) fetchDeletedDiscounts();
  }, [response]);

  const handleRestore = async (id: number) => {
    if (response?.employee?.position !== 'Manager') {
      alert('Bạn không có quyền khôi phục');
      return;
    }

    if (!confirm('Khôi phục discount này?')) return;

    try {
      const res = await fetch(`https://localhost:7240/api/Discounts/restore/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
      });

      if (res.ok) {
        alert('✅ Discount đã được khôi phục');
        fetchDeletedDiscounts();
      } else {
        alert('❌ Khôi phục thất bại');
      }
    } catch (err) {
      console.error('❌ Error restore:', err);
    }
  };

  const handleHardDelete = async (id: number) => {
    if (response?.employee?.position !== 'Manager') {
      alert('Bạn không có quyền xoá vĩnh viễn');
      return;
    }

    if (!confirm('Xác nhận xoá vĩnh viễn discount?')) return;

    try {
      const res = await fetch(`https://localhost:7240/api/Discounts/harddelete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
      });

      if (res.ok) {
        alert('🗑️ Đã xoá vĩnh viễn');
        fetchDeletedDiscounts();
      } else {
        alert('❌ Xoá thất bại');
      }
    } catch (err) {
      console.error('❌ Error hard delete:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen max-w-screen-xl w-full mx-auto px-4 py-12 rounded-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">🗑️ Discount Trashbin</h1>
        <Link
          href="/dashboard/discounts"
          className="py-2 px-6 rounded-md bg-blue-500 hover:opacity-75 text-white"
        >
          Quay lại danh sách
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : discounts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Không có discount nào đã xoá.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedDiscounts.map((discount) => (
            <div
              key={discount.discountId}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow p-4"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {discount.eventName}
              </h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                <strong>Start:</strong> {new Date(discount.eventDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                <strong>End:</strong> {new Date(discount.endDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>By:</strong> {discount.addedBy}
              </p>
              <div className="flex justify-end">
                <Popover>
                  <PopoverTrigger>
                    <div className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                      <MoreHorizontal />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="text-start space-y-2">
                    <button
                      className="w-full text-start py-2 px-4 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                      onClick={() => handleRestore(discount.discountId)}
                    >
                      ♻️ Khôi phục
                    </button>
                    <button
                      className="w-full text-start py-2 px-4 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600"
                      onClick={() => handleHardDelete(discount.discountId)}
                    >
                      🗑️ Xoá vĩnh viễn
                    </button>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination
        totalPages={Math.ceil(discounts.length / itemsPerPage)}
        currentPage={currentPage}
        pageName="discountpage"
      />
    </div>
  );
};

export default DiscountTrashbinPage;
