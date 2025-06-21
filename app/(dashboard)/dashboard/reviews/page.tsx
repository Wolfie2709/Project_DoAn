// app/dashboard/reviews/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Review } from '@/types';
import { Button } from '@/components/ui/button';

const ReviewApprovalPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch('https://localhost:7240/api/Reviews/pending');
      const data = await res.json();
      setReviews(data);
    };

    fetchReviews();
  }, []);

  const approveReview = async (reviewId: number) => {
    const res = await fetch(`https://localhost:7240/api/Reviews/approve/${reviewId}`, {
      method: 'PUT',
    });

    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📝 Pending Product Reviews</h2>
      {reviews.map((review) => (
        <div key={review.reviewId} className="border p-4 mb-3 rounded">
          <p className="font-semibold">{review.userName} đánh giá:</p>
          <p className="italic text-gray-700 mb-2">"{review.content}"</p>
          <Button onClick={() => approveReview(review.reviewId)}>✅ Phê duyệt</Button>
        </div>
      ))}
    </div>
  );
};

export default ReviewApprovalPage;
