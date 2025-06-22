"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import Pagination from "@/components/others/Pagination";
import Loader from "@/components/others/Loader";
import { Response } from "@/types";

interface Review {
  reviewId: number;
  customerId: number;
  productId: number;
  comment: string;
  rating: number;
  createdAt: string;
}

const ReviewTrashbinPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [response, setResponse] = useState<Response>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("reviewpage") || "1", 10);
  const itemsPerPage = 6;

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("food-storage");
      if (!stored) throw new Error("Bạn chưa đăng nhập");

      const parsed = JSON.parse(stored)?.state;
      if (!parsed?.employee) throw new Error("Không có quyền truy cập");

      setResponse(parsed);
    } catch (err) {
      alert(err);
      router.push("/dashboard");
    }
  }, []);

  const fetchReviews = async () => {
    if (!response?.accessToken) return;
    try {
      const res = await fetch("https://localhost:7240/api/Reviews/deleted", {
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
      });
      const data: Review[] = await res.json();
      setReviews(data);
      setFilteredReviews(data);
    } catch (err) {
      console.error("❌ Lỗi fetch review đã xoá:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [response]);

  const handleDelete = async (id: number) => {
    if (response?.employee?.position !== "Manager") {
      alert("Bạn không có quyền xoá vĩnh viễn");
      return;
    }

    if (!confirm("Xác nhận xoá vĩnh viễn review?")) return;

    try {
      const res = await fetch(
        `https://localhost:7240/api/Reviews/hard-delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${response.accessToken}`,
          },
        }
      );
      if (res.ok) {
        alert("🗑️ Đã xoá vĩnh viễn");
        fetchReviews();
      } else {
        alert("❌ Xoá thất bại");
      }
    } catch (err) {
      console.error("❌ Error hard delete:", err);
    }
  };

  const handleRestore = async (id: number) => {
    if (response?.employee?.position !== "Manager") {
      alert("Bạn không có quyền khôi phục");
      return;
    }

    if (!confirm("Khôi phục review này?")) return;

    try {
      const res = await fetch(
        `https://localhost:7240/api/Reviews/restore/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${response.accessToken}`,
          },
        }
      );
      if (res.ok) {
        alert("✅ Review đã được khôi phục");
        fetchReviews();
      } else {
        alert("❌ Khôi phục thất bại");
      }
    } catch (err) {
      console.error("❌ Error restore:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen max-w-screen-xl w-full mx-auto px-4 py-12 rounded-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          🗑️ Review Trashbin
        </h1>
        <Link
          href="/dashboard/reviews"
          className="py-2 px-6 rounded-md bg-blue-500 hover:opacity-75 text-white"
        >
          Quay lại danh sách
        </Link>
      </div>

      {paginatedReviews.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Không có review nào đã xoá.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedReviews.map((review) => (
            <div
              key={review.reviewId}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md p-4"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Review #{review.reviewId}
              </h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                <strong>Customer:</strong> {review.customerId}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                <strong>Product:</strong> {review.productId}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                <strong>Rating:</strong> {review.rating} ⭐
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>Comment:</strong> {review.comment}
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
                      onClick={() => handleRestore(review.reviewId)}
                    >
                      ♻️ Khôi phục
                    </button>
                    <button
                      className="w-full text-start py-2 px-4 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600"
                      onClick={() => handleDelete(review.reviewId)}
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

      <Suspense fallback={<Loader />}>
        <Pagination
          totalPages={Math.ceil(filteredReviews.length / itemsPerPage)}
          currentPage={currentPage}
          pageName="reviewpage"
        />
      </Suspense>
    </div>
  );
};

export default ReviewTrashbinPage;
