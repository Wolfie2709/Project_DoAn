"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // hoặc 'next/router' nếu dùng Next.js cũ
import BreadcrumbComponent from '@/components/others/Breadcrumb';
import EditEmployeeForm, { EmployeeFormData } from '@/components/dashboard/forms/EditEmployeeForm';

const EditEmployeePage = () => {
  const params = useParams();
  const id = typeof params === "object" && "id" in params ? params.id : "";
  const [employee, setEmployee] = useState<EmployeeFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy dữ liệu nhân viên khi component mount hoặc id thay đổi
  useEffect(() => {
    if (!id) return;

    fetch(`https://localhost:7240/api/Employees/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch employee');
        return res.json();
      })
      .then(data => {
        setEmployee(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Hàm gọi API PUT cập nhật dữ liệu nhân viên
  const handleEditSubmit = (updatedData: EmployeeFormData) => {
    fetch(`https://localhost:7240/api/Employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update employee');
        alert('Successfully updated employee!');
      })
      .catch(err => {
        alert('Error when updating employee');
        console.error(err);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!employee) return <div>Can not find employee</div>;

  return (
    <div className="p-2 w-full">
      <BreadcrumbComponent links={['/dashboard', '/employees']} pageText="Edit Employee" />
      <EditEmployeeForm employee={employee} onSubmitEdit={handleEditSubmit} />
    </div>
  );
};

export default EditEmployeePage;
