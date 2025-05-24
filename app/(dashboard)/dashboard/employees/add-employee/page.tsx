import AddEmployeeForm from '@/components/dashboard/forms/EmployeeForm'
import BreadcrumbComponent from '@/components/others/Breadcrumb'
import React from 'react'

const AddEmployeePage = () => {
  return (
    <div className='p-2 w-full'>
      <BreadcrumbComponent links={['/dashboard','/employees']} pageText='add employee'/>
      <AddEmployeeForm />
    </div>
  )
}

export default AddEmployeeForm