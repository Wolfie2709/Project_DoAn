'use client'
import React from 'react';

const getCustomerById = async (id: string) => {
  const res = await fetch(`https://localhost:7240/api/Customers/${id}`, {
    cache: 'no-store' // avoid caching during SSR
  });
  if (!res.ok) {
    throw new Error('Failed to fetch customer');
  }
  return res.json();
};

const ViewCustomerPage = async ({ params }: { params: { id: string } }) => {
  const customer = await getCustomerById(params.id);

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen max-w-screen-xl w-full mx-auto px-4 py-12 m-2 rounded-md">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-8">
          Customer Information
        </h1>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Id</label>
              <p className="text-gray-800 dark:text-white">{customer.customerId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <p className="text-gray-800 dark:text-white">{customer.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
              <p className="text-gray-800 dark:text-white">{customer.cusername}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
              <p className="text-gray-800 dark:text-white">{customer.gender}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Birthday</label>
              <p className="text-gray-800 dark:text-white">{customer.birthday}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <p className="text-gray-800 dark:text-white">{customer.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
              <p className="text-gray-800 dark:text-white">{customer.address}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
              <p className="text-gray-800 dark:text-white">{customer.phoneNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Created At</label>
              <p className="text-gray-800 dark:text-white">{new Date(customer.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCustomerPage;
