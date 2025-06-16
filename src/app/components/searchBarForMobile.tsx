
"use client"
import { SearchIcon, X } from "lucide-react"
import type React from "react"

import { Input } from "@/components/ui/input"
import { useState } from "react"
import useAppContext from "@/context/ContextAPI"
import { useRouter } from "next/navigation"

export default function SearchBarForMobile({
  isOpen = false,
  close,
}: {
  isOpen?: boolean
  close: (isOpen:boolean)=> void;
}) {
  const { setSearchTerm, setSearchCategories } = useAppContext()
  const [inputValue, setInputValue] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      // Set search term in context
      setSearchTerm(inputValue.trim())

      // Check if search term matches any category
      const categories = ["Men", "Women", "Kids", "Perfume"]
      const matchedCategory = categories.find((cat) => cat.toLowerCase() === inputValue.trim().toLowerCase())

      if (matchedCategory) {
        setSearchCategories([matchedCategory])
      } else {
        setSearchCategories([])
      }

      // Close search modal
      close(false)

      // Navigate to collection page with search parameters
      const searchParams = new URLSearchParams()
      searchParams.set("search", inputValue.trim())
      if (matchedCategory) {
        searchParams.set("search", matchedCategory)
      }

      router.push(`/search?${searchParams.toString()}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e as any)
    }
  }

  // Handle quick category selection
  const handleCategoryClick = (category: string) => {
    setSearchTerm("")
    setSearchCategories([category])
    close(false)

    const searchParams = new URLSearchParams()
    searchParams.set("search", category)
    router.push(`/search?${searchParams.toString()}`)
  }

  return (
    <div
      className={`min-h-screen w-[90vw] sm:w-96 z-50 fixed left-0 top-0 bg-white ${
        isOpen ? "" : "-translate-x-full"
      } transition-all duration-300 overflow-x-hidden px-6 pt-5`}
    >
      <div className="">
        <div className="flex items-center w-full justify-between">
          <div className="font-medium">Search</div>
          <div onClick={() => close(false)} className="cursor-pointer">
            <X />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative mt-9">
        <Input
          placeholder="Search Products..."
          className="text-xs bg-gray-100 pr-10 border-0"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          // onKeyPress={handleKeyPress}
        />
        <button type="submit" className="absolute right-2 top-3">
          <SearchIcon size={20} />
        </button>
      </form>

      {/* Quick Category Filters */}
      <div className="mt-8">
        <h3 className="text-sm font-medium mb-4 text-gray-700">Quick Categories</h3>
        <div className="grid grid-cols-2 gap-3">
          {["Men", "Women", "Kids", "Perfume"].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left text-sm font-medium transition-colors border border-gray-200 hover:border-gray-300"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Search Tips */}
      <div className="mt-8 p-4 bg-pink-50 rounded-lg">
        <h3 className="text-sm font-medium mb-2 text-pink-800">Search Tips</h3>
        <ul className="text-xs text-Pink-600 space-y-1">
          <li>• Type category names (Men, Women, Kids, Perfume) for quick filtering</li>
          <li>• Search for specific products or styles</li>
          <li>• Use the category buttons,title, description for instant results</li>
        </ul>
      </div>
    </div>
  )
}
