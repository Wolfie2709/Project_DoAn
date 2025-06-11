'use client'
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import { useAuthStore } from '@/store/authStore';

const getCustomerById = async (id: string) => {
  const res = await fetch(`https://localhost:7240/api/Customers/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch customer');
  }
  return res.json();
};

const getEmployeeById = async (id: string) => {
  const res = await fetch(`https://localhost:7240/api/Employees/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch employee');
  }
  return res.json();
};

const MyAccountPage = () => {
  const customerSession = useAuthStore((state) => state.customer);
  const employeeSession = useAuthStore((state) => state.employee);
  const [user, setUser] = useState<any>(null); // Replace `any` with a union type if you want stricter typing
  const [loading, setLoading] = useState(true);


    useEffect(() => {
    const fetchUser = async () => {
      try {
        if (customerSession?.customerId) {
          const data = await getCustomerById(customerSession.customerId.toString());
          setUser({ ...data, type: 'customer' });
        } else if (employeeSession?.employeeId) {
          const data = await getEmployeeById(employeeSession.employeeId.toString());
          setUser({ ...data, type: 'employee' });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [customerSession, employeeSession]);

  if (!customerSession && !employeeSession) {
    return <p className="p-4 text-center text-red-500">Please log in to view your account.</p>;
  }

  if (loading) {
    return <p className="p-4 text-center text-gray-500">Loading account details...</p>;
  }

  if (!user) {
    return <p className="p-4 text-center text-red-500">Failed to load account information.</p>;
  }


  return (
    <div className="px-4 py-8 lg:px-16 lg:py-12 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-8">My Account</h1>

        {/* Personal Information */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <p className="text-gray-800 dark:text-white">{user.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
              <p className="text-gray-800 dark:text-white">{user.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <p className="text-gray-800 dark:text-white">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
              <p className="text-gray-800 dark:text-white">{user.phoneNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Birthday</label>
              <p className="text-gray-800 dark:text-white">
                {new Date(user.birthday).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
              <p className="text-gray-800 dark:text-white">{user.gender}</p>
            </div>
            {user.type === 'employee' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
              <p className="text-gray-800 dark:text-white">{user.position}</p>
            </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Address</h2>
            <Link href="/my-account/edit" className="p-2 rounded-md border">
              Edit Address
            </Link>
          </div>
          <p className="text-gray-800 dark:text-white">{user.address}</p>
        </div>

        {/* Order History */}
         {user.type === 'customer' && (
        <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Order History</h2>
          <div className="border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-800 dark:text-white">Order</p>
              <p className="text-gray-800 dark:text-white">$XX.XX</p>
            </div>
            <p className="text-gray-500 dark:text-gray-400">Date: MM/DD/YYYY</p>
            <p className="text-gray-500 dark:text-gray-400">Status: Shipped</p>
          </div>
        </div>
          )}
      </div> 
    </div>
  );
};

export default MyAccountPage;
