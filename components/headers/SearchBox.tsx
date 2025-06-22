"use client"
import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Search, X, Loader2 } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Product {
  productId: number
  name: string
  price: number
  discountedPrice?: number
  discount?: number
  imageUrl: string
  category?: {
    categoryId: number
    name: string
  }
  brand?: {
    brandId: number
    name: string
  }
}

interface Category {
  categoryId: number
  name: string
  description?: string
  imageUrl?: string
}

interface SearchSuggestion {
  type: "product" | "category"
  id: number
  name: string
  image?: string
  price?: number
  discountedPrice?: number
  discount?: number
  category?: string
  brand?: string
}

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Fetch search suggestions
  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)
    try {
      // Search products using your actual API
      const productsResponse = await fetch(
        `https://localhost:7240/api/Products/search?query=${encodeURIComponent(query)}&limit=5`,
      )

      let products: Product[] = []
      if (productsResponse.ok) {
        products = await productsResponse.json()
      }

      // Search categories using your actual API
      const categoriesResponse = await fetch(
        `https://localhost:7240/api/Categories/search?query=${encodeURIComponent(query)}&limit=3`,
      )

      let categories: Category[] = []
      if (categoriesResponse.ok) {
        categories = await categoriesResponse.json()
      }

      // Transform data to suggestions based on your API structure
      const productSuggestions: SearchSuggestion[] = products.map((product) => ({
        type: "product",
        id: product.productId,
        name: product.name,
        image: product.imageUrl,
        price: product.price,
        discountedPrice: product.discountedPrice,
        discount: product.discount,
        category: product.category?.name,
        brand: product.brand?.name,
      }))

      const categorySuggestions: SearchSuggestion[] = categories.map((category) => ({
        type: "category",
        id: category.categoryId,
        name: category.name,
        image: category.imageUrl,
      }))

      const allSuggestions = [...productSuggestions, ...categorySuggestions]
      setSuggestions(allSuggestions)
      setShowSuggestions(allSuggestions.length > 0)
    } catch (error) {
      console.error("Error fetching search suggestions:", error)
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(searchTerm)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchTerm])

  // Handle form submission
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    const params = new URLSearchParams(searchParams)
    params.set("query", searchTerm.trim())

    router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`)
    setSearchTerm("")
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === "product") {
      router.push(`/shop/${suggestion.id}`)
    } else if (suggestion.type === "category") {
      router.push(`/shop?categoryId=${suggestion.id}`)
    }

    setSearchTerm("")
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex])
        } else {
          onFormSubmit(e as any)
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Clear search term when navigating away from search page
  useEffect(() => {
    if (pathname !== "/search") {
      setSearchTerm("")
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }, [pathname])

  // Get current search query from URL
  useEffect(() => {
    const query = searchParams.get("query")
    if (query && pathname === "/search") {
      setSearchTerm(query)
    }
  }, [searchParams, pathname])

  const clearSearch = () => {
    setSearchTerm("")
    setSuggestions([])
    setShowSuggestions(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <form
        onSubmit={onFormSubmit}
        className="flex items-center border-2 border-gray-200 dark:border-gray-700 w-full rounded-lg bg-white dark:bg-gray-800 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors"
      >
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true)
              }
            }}
            className="p-2 rounded-md w-full lg:w-64 border-none outline-none focus:outline-none focus-visible:ring-offset-0 focus-visible:ring-0 pr-8"
            placeholder="Search products, categories..."
            autoComplete="off"
          />

          {/* Clear button */}
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <Button
          type="submit"
          className="hover:opacity-70 duration-200 px-3"
          variant="link"
          disabled={!searchTerm.trim()}
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
        </Button>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.type}-${suggestion.id}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                "flex items-center gap-3 p-3 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors",
                selectedIndex === index ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-700",
              )}
            >
              {/* Suggestion Image */}
              {suggestion.image && (
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src={suggestion.image || "/placeholder.svg"}
                    alt={suggestion.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}

              {/* Suggestion Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{suggestion.name}</span>

                  {/* Type Badge */}
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      suggestion.type === "product"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                    )}
                  >
                    {suggestion.type}
                  </span>
                </div>

                {/* Product Price */}
                {suggestion.type === "product" && suggestion.price && (
                  <div className="flex items-center gap-2 mt-1">
                    {suggestion.discountedPrice ? (
                      <>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          ${suggestion.discountedPrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500 line-through">${suggestion.price.toFixed(2)}</span>
                        {suggestion.discount && (
                          <span className="text-xs text-red-500">-${suggestion.discount.toFixed(2)}</span>
                        )}
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${suggestion.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                )}

                {/* Category and Brand for products */}
                {suggestion.type === "product" && (
                  <div className="flex items-center gap-2 mt-1">
                    {suggestion.category && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">in {suggestion.category}</span>
                    )}
                    {suggestion.brand && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">by {suggestion.brand}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Arrow Icon */}
              <div className="text-gray-400">
                <Search size={16} />
              </div>
            </div>
          ))}

          {/* View All Results */}
          {searchTerm && (
            <Link
              href={`/search?query=${encodeURIComponent(searchTerm)}`}
              className="block p-3 text-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-t border-gray-200 dark:border-gray-700 font-medium"
              onClick={() => {
                setShowSuggestions(false)
                setSelectedIndex(-1)
              }}
            >
              View all results for "{searchTerm}"
            </Link>
          )}
        </div>
      )}

      {/* No Results */}
      {showSuggestions && suggestions.length === 0 && searchTerm.length >= 2 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">No results found for "{searchTerm}"</p>
          <Link
            href={`/search?query=${encodeURIComponent(searchTerm)}`}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2 inline-block"
            onClick={() => {
              setShowSuggestions(false)
              setSelectedIndex(-1)
            }}
          >
            Search anyway
          </Link>
        </div>
      )}
    </div>
  )
}

export default SearchBox
