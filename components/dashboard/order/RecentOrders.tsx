import React from 'react';
import OrderActions from './OrderActions';
import { OrderHomeDto } from "@/types";

type Props = {
  recentOrderList: Array<OrderHomeDto>;
};

const RecentOrdersSection = ({recentOrderList}: Props) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentOrderList.map((order) => (
              <tr key={order.orderId} className="bg-white dark:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">{order.orderId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.estimatedDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">$ {order.totalCost} </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.orderStatus === 'Shipped' ? 'bg-green-100 text-green-800' : order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{order.orderStatus}</span>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  <OrderActions />
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersSection;
