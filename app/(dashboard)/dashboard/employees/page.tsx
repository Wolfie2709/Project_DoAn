"use client";
import SearchEmployee from "@/components/dashboard/employee/SearchEmployee";
import Loader from "@/components/others/Loader";
import Pagination from "@/components/others/Pagination";
import Image from "next/image";
import React, { Suspense, useState } from "react";
import { Employee } from "@/types";
import { useEffect } from "react";
import Link from "next/link";
import EmployeeActions from "@/components/dashboard/employee/EmployeeAction";

const EmployeePage = () => {
  // Dummy data for demonstration

  const [Employees, setEmployees] = useState<Employee[]>([]);

  const fetchEmployees = async() => {
      try{
          const res = await fetch(`https://localhost:7240/api/Employees`);
          const data: Employee[] = await res.json();
    
          setEmployees(data);
        } catch (error) {
          console.error("Failed to fetch employees", error);
          setEmployees([]);
        }
    }

  const deleteEmployee = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this employee?");
    if (!confirmed) return;

    try {
      const res = await fetch(`https://localhost:7240/api/Employees/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchEmployees();
      } else {
        console.error("Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

    useEffect(() => {
  fetchEmployees();
}, []);

  return (
    <div className="max-w-screen-xl w-full p-4 my-4 mx-auto dark:bg-slate-900 rounded-md">
      <div className="flex items-center justify-between gap-2 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white ">
          Employees
        </h2>
        <SearchEmployee />
      </div>
       <div className="flex justify-end my-4">
        <Link
          href={"/dashboard/employees/add-employee"}
          className="py-2 px-6 rounded-md bg-blue-500 hover:opacity-60 text-white"
        >
          Add Employee
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y dark:text-slate-100 divide-gray-200 dark:divide-gray-700 border">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Position
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Phone number
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
            {Employees.map((employee) => (
              <tr key={employee.employeeId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {employee.employeeId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                  {employee.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm ">
                  {employee.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {employee.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {employee.phoneNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {employee.lastLogin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <EmployeeActions
                    employeeId={employee.employeeId}
                    onDelete={() => deleteEmployee(employee.employeeId)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Suspense fallback={<Loader />}>
        <Pagination totalPages={5} currentPage={1} pageName="employeepage" />
      </Suspense>
    </div>
  );
};

export default EmployeePage;
