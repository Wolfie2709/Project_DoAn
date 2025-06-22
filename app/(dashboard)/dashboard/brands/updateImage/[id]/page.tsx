'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Response } from "@/types"

export default function UpdateImagePage() {
  const { id } = useParams();
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState('');
  const [originalImage, setOriginalImage] = useState<any>(null);
  const [response, setResponse] = useState<Response>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  useEffect(() => {
    if (!response || !response.accessToken) return;

    //prevent clerk from access update view
    try {
      if (response.employee?.position != "Manager") {
        throw new Error("Ban khong co quyen truy cap")
      }
    } catch (error) {
      alert(error)
      router.push("/dashboard/brands")
    }
  }, [response])

  useEffect(() => {
    const fetchImage = async () => {
      if (!response || !response.accessToken) return;
      if (response.employee?.position != "Manager") {
        alert("Ban khong co quyen truy cap")
        return;
      }

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
  }, [id, response]);

  const handleUpdate = async () => {
    if (!response?.accessToken) throw new Error("Không có token đăng nhập");
    if (response.employee?.position != "Manager") {
      alert("Ban khong co quyen truy cap");
      throw new Error("Position khong hop le");
    }

    if (!selectedFile) {
      alert("Vui lòng chọn file ảnh mới");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(`https://localhost:7240/api/Images/updateWithFile/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update image");
      alert("Image updated successfully");
      router.push("/dashboard/brands");
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen max-w-screen-xl w-full mx-auto px-4 py-12 m-2 rounded-md">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Update Image</h2>

      {imageUrl && (
        <div className="mb-4">
          <img src={`http://localhost:5267${imageUrl}`} alt="Current" className="w-full h-64 object-contain border rounded" />
        </div>
      )}

      <div className="mb-4">
        <Label htmlFor="newImage">Upload New Image</Label>
        <Input
          id="newImage"
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        />
      </div>

      <Button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Update Image
      </Button>
    </div>
  );
}
