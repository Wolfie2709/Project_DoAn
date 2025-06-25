'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
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

const getOrdersForCustomer = async () => {
  const res = await fetch(`https://localhost:7240/api/Orders/with-customer`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch orders');
  }
  return res.json();
};

const MyAccountPage = () => {
  const customerSession = useAuthStore((state) => state.customer);
  const employeeSession = useAuthStore((state) => state.employee);
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (customerSession?.customerId) {
          const customer = await getCustomerById(customerSession.customerId.toString());
          const orderData = await getOrdersForCustomer();
          setUser({ ...customer, type: 'customer' });
          setOrders(orderData);
        } else if (employeeSession?.employeeId) {
          const employee = await getEmployeeById(employeeSession.employeeId.toString());
          setUser({ ...employee, type: 'employee' });
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

        {/* Avatar
        <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Address</h2>
            <Link href="/my-account/edit" className="p-2 rounded-md border">
              Edit Address
            </Link>
          </div>
          <p className="text-gray-800 dark:text-white">{user.address}</p>
        </div> */}

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
              <p className="text-gray-800 dark:text-white">{user.cusername || user.eusername}</p>
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
              <p className="text-gray-800 dark:text-white">{new Date(user.birthday).toLocaleDateString()}</p>
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
            {orders.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">You have no orders.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.orderId} className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-800 dark:text-white font-medium">Order #{order.orderId}</p>
                      <p className="text-gray-800 dark:text-white font-semibold">
                        ${order.totalCost ? order.totalCost.toFixed(2) : '0.00'}
                      </p>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Date: {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">Status: {order.status}</p>
                    <p className="text-gray-500 dark:text-gray-400">Shipping Address: {order.shippingAddress}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccountPage;
