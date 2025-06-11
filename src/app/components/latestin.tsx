"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import LatestInSkeleton from "./LatestInSkeleton"

interface Product {
  _id: string
  title: string 
  description: string
  price: number
  isNew:boolean;
  originalPrice?: number
  imageUrl: string 
  category?: string
  tags?: string[]
}

const LatestIn = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
const response =
  await client.fetch(`*[_type == "product"] | order(_createdAt desc)[0...16]{
          title, 
          price, 
          tags[], 
          _id, 
          isNew,
          description, 
        "imageUrl": thumbnail.asset -> url,
        }`);

        // console.log("Fetched products:", response)
        if(response && response?.length > 0){
        setProducts(response)
        }else{
          setProducts([])
        }
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

    if (loading) return <LatestInSkeleton itemCount={8} />
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>

  return (
    <div className="flex overflow-x-auto scrollbar-hide sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-8">
      {products.map((item) => (
        <div
          key={item._id}
          className="text-xs shrink-0 text-center relative space-y-3"
        >
          {item._id ? (
            <Link href={`/collection/${item._id}`}>
              {item.imageUrl ? (
                <div className=" h-52 sm:h-80 w-full bg-gray-100 ">
                  <Image
                    src={urlFor(item.imageUrl).url() || "/placeholder.svg"}
                    alt={`${item.title}`}
                    width={500}
                    height={500}
                    className="w-full max-h-full mx-auto my-auto object-cover"
                    onError={(e) => {
                      console.error(
                        "Image failed to load for product:",
                        item.title
                      );
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1602524204986-6cfd29f63c41";
                    }}
                  />
                </div>
              ) : (
                <div className="w-full  h-52 sm:h-80 flex items-center justify-center bg-gray-200">
                  <p className="text-gray-500">No image available</p>
                </div>
              )}

              <div className="hover:underline mt-2 underline-offset-4 text-gray-700 font-medium">
                {item.title}
              </div>
              <div className="font-semibold text-sm">Rs {item.price}</div>
              {item.isNew && (
                <div className="absolute top-1 sm:top-3 left-0 font-medium text-[9px] sm:text-xs text-white bg-[#ffbb49] sm:py-1 sm:px-2 px-1 py-0.5">
                  New In
                </div>
              )}
            </Link>
          ) : (
            <p className="text-red-500 text-center">Product unavailable</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default LatestIn
