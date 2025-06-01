'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function UpdateImagePage() {
  const { id } = useParams();
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState('');
  const [originalImage, setOriginalImage] = useState<any>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`https://localhost:7240/api/Images/${id}`);
        const data = await res.json();
        setImageUrl(data.imageUrl || '');
        setOriginalImage(data); // lưu lại bản gốc để giữ dữ liệu không bị sửa
      } catch (error) {
        console.error('Failed to fetch image:', error);
      }
    };
    fetchImage();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const updatedImage = {
        ...originalImage, // giữ lại các thông tin không thay đổi
        imageUrl: imageUrl, // chỉ thay đổi imageUrl
      };

      const res = await fetch(`https://localhost:7240/api/Images/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedImage),
      });

      if (!res.ok) throw new Error('Failed to update image');
      alert('Image updated successfully');
      router.push('/dashboard/categories'); // hoặc trở lại trang trước
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen max-w-screen-xl w-full mx-auto px-4 py-12 m-2 rounded-md">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Update Image</h2>

      {imageUrl && (
        <div className="mb-4">
          <img src={imageUrl} alt="Current" className="w-full h-64 object-contain border rounded" />
        </div>
      )}

      <div className="mb-4">
        <Label htmlFor="imageUrl" className="text-sm font-medium">Image URL</Label>
        <Input
          id="imageUrl"
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="mt-1"
        />
      </div>

      <Button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Update Image
      </Button>
    </div>
  );
}
