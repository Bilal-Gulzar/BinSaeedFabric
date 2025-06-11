

"use client"
import { Input } from "@/components/ui/input"
import { SearchIcon, X } from "lucide-react"
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import SearchBarForMobile from "./searchBarForMobile"
import useAppContext from "@/context/ContextAPI"
import { useRouter } from "next/navigation"

export default function Search() {
  const { search, setSearch, setSearchTerm, setSearchCategories } = useAppContext()
  const [inputValue, setInputValue] = useState("")
  const router = useRouter()

  const modalRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!modalRef.current) return

    if (search) {
      disableBodyScroll(modalRef.current)
    } else {
      enableBodyScroll(modalRef.current)
    }

    return () => {
      if (modalRef.current) enableBodyScroll(modalRef.current)
    }
  }, [search])

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
      setSearch(false)

      // Navigate to collection page with search parameters
      const searchParams = new URLSearchParams()
      searchParams.set("search", inputValue.trim())
      if (matchedCategory) {
        searchParams.set("category", matchedCategory)
      }

      router.push(`/search?${searchParams.toString()}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e as any)
    }
  }

  return (
    <aside className={`${search ? "fixed bg-black/80 inset-0 z-50 min-h-screen" : ""}`}>
      <section
        className={`bg-white h-32 px-12 py-7 ${
          search ? "" : "-translate-y-full"
        } transition-all duration-300 overflow-hidden fixed top-0 w-full lg:block hidden`}
        ref={modalRef}
      >
        <div onClick={() => setSearch(false)} className="flex flex-col items-end pe-3 mb-2 w-full">
          <X />
        </div>
        <form onSubmit={handleSearch} className="relative">
          <Input
            placeholder="Search Products or Categories (Men, Women, Kids, Perfume)..."
            className="text-xs border-gray-100 shadow-xs focus:border-0"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button type="submit" className="absolute right-3 top-3">
            <SearchIcon size={20} />
          </button>
        </form>
      </section>
      <section className="lg:hidden">
        <SearchBarForMobile isOpen={search} close={setSearch} />
      </section>
    </aside>
  )
}
