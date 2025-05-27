// components/dashboard/brand/SearchBrands.tsx
import { Input } from '@/components/ui/input'
import React from 'react'

interface SearchBrandsProps {
  onSearch: (query: string) => void
}

const SearchBrands: React.FC<SearchBrandsProps> = ({ onSearch }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value)
  }

  return (
    <div>
      <Input
        placeholder='Search Brand by name'
        className='p-5 rounded-md w-full lg:w-96'
        onChange={handleInputChange}
      />
    </div>
  )
}

export default SearchBrands
