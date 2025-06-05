import { Input } from '@/components/ui/input'
import React from 'react'

interface SearchEmployeesProps {
  onSearch: (query: string) => void
}

const SearchEmployee: React.FC<SearchEmployeesProps> = ({ onSearch }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value)
  }

  return (
    <div>
      <Input
        placeholder='Search Employee by name'
        className='p-5 rounded-md w-full lg:w-96'
        onChange={handleInputChange}
      />
    </div>
  )
}

export default SearchEmployee
