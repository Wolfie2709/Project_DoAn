import AddEmployeeForm from '@/components/dashboard/forms/EmployeeForm'
import BreadcrumbComponent from '@/components/others/Breadcrumb'
import React from 'react'

const AddBlogPage = () => {
  return (
    <div className='p-2 w-full'>
      <BreadcrumbComponent links={['/dashboard','/blogs']} pageText='add blog'/>
      <AddEmployeeForm />
    </div>
  )
}

export default AddEmployeeForm