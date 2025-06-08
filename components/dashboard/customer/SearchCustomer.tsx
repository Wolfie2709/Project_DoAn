import { Input } from '@/components/ui/input'
import React from 'react'

interface SearchCustomersProps {
  onSearch: (query: string) => void
}

const SearchCustomer: React.FC<SearchCustomersProps> = ({ onSearch }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value)
  }

  return (
    <div>
      <Input
        placeholder='Search Customer by name'
        className='p-5 rounded-md w-full lg:w-96'
        onChange={handleInputChange}
      />
    </div>
  )
}

export default SearchCustomer