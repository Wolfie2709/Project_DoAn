'use client'
import Link from 'next/link';
import React from 'react';
import { useAuthStore } from '@/store/authStore';

const getEmployeeById = async (id: string) => {
  const res = await fetch(`https://localhost:7240/api/Employees/${id}`, {
    cache: 'no-store' // tránh cache trong SSR
  });
  if (!res.ok) {
    throw new Error('Failed to fetch employee');
  }
  return res.json();
};

const ViewEmployeePage = async ({ params }: { params: { id: string } }) => {
  const employee = await getEmployeeById(params.id);


  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen max-w-screen-xl w-full mx-auto px-4 py-12 m-2 rounded-md">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-8">
          Employee Information
        </h1>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Id</label>
              <p className="text-gray-800 dark:text-white">{employee.employeeId}</p>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <p className="text-gray-800 dark:text-white">{employee.fullName}</p>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
              <p className="text-gray-800 dark:text-white">{employee.gender}</p>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
              <p className="text-gray-800 dark:text-white">{employee.position}</p>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Birthday</label>
              <p className="text-gray-800 dark:text-white">{employee.birthday}</p>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <p className="text-gray-800 dark:text-white">{employee.email}</p>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
              <p className="text-gray-800 dark:text-white">{employee.address}</p>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone number</label>
              <p className="text-gray-800 dark:text-white">{employee.phoneNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployeePage;
