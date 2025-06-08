'use client';
import SearchEmployee from "@/components/dashboard/employee/SearchEmployee";
import Loader from "@/components/others/Loader";
import Pagination from "@/components/others/Pagination";
import { Trash } from "lucide-react";
import React, { useState, useEffect, Suspense } from "react";
import { Customer } from "@/types";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import CustomerActions from "@/components/dashboard/customer/CustomerActions";

const CustomerPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = parseInt(searchParams.get("customerpage") || "1", 10);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`https://localhost:7240/api/Customers`);
      const data: Customer[] = await res.json();
      const activeCustomers = data.filter(c => c.isDeletedStatus === false);
      setCustomers(activeCustomers);
      setFilteredCustomers(activeCustomers);
    } catch (error) {
      console.error("Failed to fetch customers", error);
      setCustomers([]);
      setFilteredCustomers([]);
    }
  };

  const deleteCustomer = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this customer?");
    if (!confirmed) return;

    try {
      const res = await fetch(`https://localhost:7240/api/Customers/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchCustomers();
      } else {
        console.error("Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers.filter((customer) =>
      customer.fullName?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="max-w-screen-xl w-full p-4 my-4 mx-auto dark:bg-slate-900 rounded-md">
      <div className="flex items-center justify-between gap-2 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Customers
        </h2>
        <SearchEmployee onSearch={handleSearch} />
      </div>
      <div className="flex justify-end my-4 space-x-4">
        <Link
          href={"/dashboard/customers/customer-trashbin"}
          className="py-2 px-6 rounded-md bg-blue-500 hover:opacity-60 text-white"
        >
          <Trash />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y dark:text-slate-100 divide-gray-200 dark:divide-gray-700 border">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
            {paginatedCustomers.map((customer) => (
              <tr key={customer.customerId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {customer.customerId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {customer.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {customer.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {customer.phoneNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {customer.lastLogin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <CustomerActions
                    customerId={customer.customerId}
                    onDelete={() => deleteCustomer(customer.customerId)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Suspense fallback={<Loader />}>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          pageName="customerpage"
        />
      </Suspense>
    </div>
  );
};

export default CustomerPage;
