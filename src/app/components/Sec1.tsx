
"use client"
import { useState, useEffect } from "react"
import type React from "react"

import Image from "next/image"
import Link from "next/link"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  imageUrl: string
  category?: string
  tags?: string[]
  inStock?: boolean
}

interface Sec1Props {
  gridCols?: 1 | 2 | 3 | 4
  filters?: {
    categories?: string[]
    priceRange?: [number, number]
    inStock?: boolean
  }
  sortOption?: string
}

const Sec1: React.FC<Sec1Props> = ({ gridCols = 2, filters = {}, sortOption = "dateN" }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [imageError, setImageError] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetch("https://677d93bc4496848554cb2350.mockapi.io/productsDetails/productDetails")
        const fetchedProducts = await data.json()
        console.log("Fetched products:", fetchedProducts)

        setProducts(fetchedProducts)
      } catch (err) {
        setError("Failed to load products. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    // Apply filters
    let result = [...products]

    // Filter by category if specified
    if (filters.categories && filters.categories.length > 0) {
      result = result.filter((product) => product.category && filters.categories?.includes(product.category))
    }

    // Filter by price range if specified
    if (filters.priceRange) {
      const [min, max] = filters.priceRange
      result = result.filter((product) => product.price >= min && product.price <= max)
    }

    // Filter by stock status if specified
    if (filters.inStock !== undefined) {
      result = result.filter((product) => product.inStock === filters.inStock)
    }

    // Apply sorting
    if (sortOption) {
      result = sortProducts(result, sortOption)
    }

    setFilteredProducts(result)
  }, [products, filters, sortOption])

  const sortProducts = (productsToSort: Product[], option: string) => {
    const productsCopy = [...productsToSort]

    switch (option) {
      case "featured":
        // Assuming featured products would have a specific tag or property
        return productsCopy
      case "Best-selling":
        // Would need sales data, returning unsorted for now
        return productsCopy
      case "A-Z":
        return productsCopy.sort((a, b) => a.name.localeCompare(b.name))
      case "Z-A":
        return productsCopy.sort((a, b) => b.name.localeCompare(a.name))
      case "PriceL":
        return productsCopy.sort((a, b) => a.price - b.price)
      case "PriceH":
        return productsCopy.sort((a, b) => b.price - a.price)
      case "dateO":
        // Would need date field, returning unsorted for now
        return productsCopy
      case "dateN":
      default:
        // Would need date field, returning unsorted for now
        return productsCopy
    }
  }

  const handleImageError = (productId: string) => {
    setImageError((prev) => ({
      ...prev,
      [productId]: true,
    }))
  }

  // Determine grid class based on gridCols
  const getGridClass = () => {
    switch (gridCols) {
      case 1:
        return "grid-cols-1"
      case 2:
        return "grid-cols-1 sm:grid-cols-2"
      case 3:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
      case 4:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      default:
        return "grid-cols-1 sm:grid-cols-2"
    }
  }

  if (loading) return <p>Loading products...</p>
  if (error) return <p>{error}</p>

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 py-14">
        <div className="text-xs text-gray-500">Showing 0 of {products.length} products</div>
        <div className="font-semibold text-sm space-y-2 text-center">
          <div>NO PRODUCT FOUND</div>
          <div>
            USE FEWER FILTERS OR{" "}
            <span onClick={() => window.location.reload()} className="underline cursor-pointer underline-offset-2">
              CLEAR ALL
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="text-xs text-gray-500 mb-4">
        Showing {filteredProducts.length} of {products.length} products
      </div>
      <div className={`grid ${getGridClass()} gap-6`}>
        {filteredProducts.map((product) => (
          <Link href={`/product/${product._id}`} key={product._id}>
            <div className="border rounded-xl shadow p-4 transition hover:shadow-lg cursor-pointer">
              <div className={`relative w-full ${gridCols === 1 ? "h-96" : "h-48"} mb-4`}>
                <Image
                  src={
                    imageError[product._id]
                      ? "https://images.unsplash.com/photo-1602524204986-6cfd29f63c41"
                      : product.imageUrl
                  }
                  alt={product.name}
                  fill
                  className="object-cover rounded-md"
                  onError={() => handleImageError(product._id)}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <div className="flex gap-2 items-center">
                {product.originalPrice && (
                  <span className="text-gray-500 line-through">Rs.{product.originalPrice.toLocaleString()}</span>
                )}
                <p className="text-[#D12442] font-bold">Rs.{product.price.toLocaleString()}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Sec1
