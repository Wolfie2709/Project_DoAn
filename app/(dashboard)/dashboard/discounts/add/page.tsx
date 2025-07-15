// app/dashboard/discounts/add/page.tsx
'use client';

import React from 'react';
import DiscountForm from '@/components/dashboard/forms/DiscountForm';
import BreadcrumbComponent from '@/components/others/Breadcrumb';

const AddDiscountPage = () => {
  return (
    <div className="p-2 w-full">
      <BreadcrumbComponent links={['/dashboard', '/discounts']} pageText="Add Discount" />
      <DiscountForm />
    </div>
  );
};

export default AddDiscountPage;
