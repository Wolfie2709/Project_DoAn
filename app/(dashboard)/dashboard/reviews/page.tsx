'use client';

import React, { useEffect, useState } from 'react';
import { Trash2, Eye, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Kiểu dữ liệu review
type Review = {
  reviewId: number;
  customerId: number;
  productId: number;
  comment: string;
  rating: number;
  createdAt: string;
};

type Response = {
  accessToken: string;
  employee: {
    position: string;
  };
};

const ReviewPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [response, setResponse] = useState<Response>();
  const router = useRouter();

  // Lấy dữ liệu đăng nhập từ sessionStorage
  const getResponse = () => {
    try {
      const stored = sessionStorage.getItem("food-storage");
      if (!stored) throw new Error("Bạn chưa đăng nhập");
      const parsed = JSON.parse(stored);
      if (!parsed?.state?.accessToken || !parsed?.state?.employee)
        throw new Error("Thông tin đăng nhập không hợp lệ");
      setResponse(parsed.state);
    } catch (error: any) {
      alert(error.message || "Có lỗi xảy ra");
      router.push("/dashboard");
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://localhost:7240/api/Reviews");
      const data = await res.json();
      if (Array.isArray(data)) {
        setReviews(data);
      } else {
        console.error("Dữ liệu không hợp lệ", data);
        setReviews([]);
      }
    } catch (err) {
      console.error("❌ Lỗi khi fetch reviews:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const softDeleteReview = async (id: number) => {
    if (!response || !response.accessToken) return;
    if (response.employee.position !== 'Manager' && response.employee.position !== 'Admin') {
      alert("Bạn không có quyền thực hiện thao tác này.");
      return;
    }

    const confirmed = confirm("Bạn có chắc muốn ẩn review này không?");
    if (!confirmed) return;

    try {
      const res = await fetch(`https://localhost:7240/api/Reviews/soft-delete/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${response.accessToken}`
        }
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Lỗi: ${text}`);
      }

      setReviews((prev) => prev.filter((r) => r.reviewId !== id));
    } catch (error) {
      console.error("❌ Lỗi khi soft delete review:", error);
      alert("Không thể ẩn review. Vui lòng thử lại.");
    }
  };

  const openModal = (review: Review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReview(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    getResponse();
  }, []);

  useEffect(() => {
    if (response) {
      fetchReviews();
    }
  }, [response]);

  return (
    <div className="max-w-screen-xl mx-auto w-full bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 my-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review</h2>
        <Link
          href="/dashboard/reviews/review-trashbin"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition"
        >
          <Trash size={18} />
          Trash
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500">Không có review nào.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border dark:border-gray-700">
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Customer ID</th>
                <th className="px-4 py-3">Product ID</th>
                <th className="px-4 py-3">Comment</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {reviews.map((review) => (
                <tr key={review.reviewId} className="bg-white dark:bg-gray-800">
                  <td className="px-4 py-3">{review.customerId}</td>
                  <td className="px-4 py-3">{review.productId}</td>
                  <td className="px-4 py-3 truncate max-w-xs" title={review.comment}>{review.comment}</td>
                  <td className="px-4 py-3">{review.rating} ⭐</td>
                  <td className="px-4 py-3">{new Date(review.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openModal(review)}>
                      <Eye size={16} className="mr-1" /> Xem
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => softDeleteReview(review.reviewId)}>
                      <Trash2 size={16} className="mr-1" /> Ẩn
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow-lg relative">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Chi tiết Review</h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
              <p><strong>Review ID:</strong> {selectedReview.reviewId}</p>
              <p><strong>Customer ID:</strong> {selectedReview.customerId}</p>
              <p><strong>Product ID:</strong> {selectedReview.productId}</p>
              <p><strong>Rating:</strong> {selectedReview.rating} ⭐</p>
              <p><strong>Comment:</strong> {selectedReview.comment}</p>
              <p><strong>Created At:</strong> {new Date(selectedReview.createdAt).toLocaleString()}</p>
            </div>
            <div className="mt-4 text-right">
              <Button onClick={closeModal}>Đóng</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
