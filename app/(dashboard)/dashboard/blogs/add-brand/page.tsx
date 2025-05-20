import AddBrandForm from '@/components/dashboard/forms/BrandForm'
import BreadcrumbComponent from '@/components/others/Breadcrumb'
import React from 'react'

const AddBlogPage = () => {
  return (
    <div className='p-2 w-full'>
      <BreadcrumbComponent links={['/dashboard','/brands']} pageText='add brand'/>
      <AddBrandForm />
    </div>
  )
}

export default AddBlogPage