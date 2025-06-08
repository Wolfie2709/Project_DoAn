import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface CustomerActionsProps {
  customerId: number;
  onDelete: () => void;
}

const CustomerActions: React.FC<CustomerActionsProps> = ({ customerId, onDelete }) => {
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <div className="flex items-center justify-center hover:bg-slate-200 p-2 rounded-full dark:hover:bg-slate-900 duration-200">
            <MoreHorizontal />
          </div>
        </PopoverTrigger>
        <PopoverContent className="text-start">
          <Link
            href={`/dashboard/customers/view-customer/${customerId}`}
            className="py-2 px-4 rounded-md w-full block hover:bg-slate-200 dark:hover:bg-slate-900"
          >
            View Customer
          </Link>
          <button
            onClick={onDelete}
            className="w-full text-start hover:bg-slate-200 dark:hover:bg-slate-900 py-2 px-4 rounded-md"
          >
            Delete Customer
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CustomerActions;
