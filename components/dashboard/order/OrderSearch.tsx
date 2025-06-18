import { Input } from '@/components/ui/input'
import React from 'react'

interface SearchOrdersProps {
  onSearch: (query: string) => void
}

const OrderSearch: React.FC<SearchOrdersProps> = ({ onSearch }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value)
  }

  return (
    <div>
      <Input
        placeholder='Search Order by id'
        className='p-5 rounded-md w-full lg:w-96'
        onChange={handleInputChange}
      />
    </div>
  )
}

export default OrderSearch