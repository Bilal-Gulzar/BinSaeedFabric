// "use client"
// import SizeGuide from "@/app/components/sizeChart"
// import { Button } from "@/components/ui/button"
// import { Minus, Plus, RulerIcon as RulerDimensionLine, ShoppingCart } from "lucide-react"
// import Image from "next/image"
// import Link from "next/link"
// import type React from "react"
// import { useState, useEffect } from "react"
// import ReactImageMagnify from "react-image-magnify"
// import Zoom from "react-medium-image-zoom"
// import "react-medium-image-zoom/dist/styles.css"

// interface Product {
//   _id: string
//   name: string
//   description: string
//   price: number
//   originalPrice?: number
//   imageUrl: string
//   images?: string[]
//   sizes?: string[]
//   availableSizes?: string[]
//   inStock: boolean
//   category?: string
// }

// interface ProductDetailsPageProps {
//   productId: string
// }

// const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ productId }) => {
//   const [showSize, setShowSize] = useState<boolean>(false)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [product, setProduct] = useState<Product | null>(null)
//   const [selectedSize, setSelectedSize] = useState<string>("")
//   const [quantity, setQuantity] = useState(1)
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0)
//   const [cart, setCart] = useState<any[]>([])

//   // Default sizes if not provided by API
//   const defaultSizes = ["Small", "Medium", "Large", "Extra Large"]
//   const unavailableSizes = ["Small", "Extra Large"] // Mock unavailable sizes

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await fetch("https://677d93bc4496848554cb2350.mockapi.io/productsDetails/productDetails")
//         const products = await response.json()

//         // Find the specific product by ID
//         const foundProduct = products.find((p: Product) => p._id === productId)

//         if (foundProduct) {
//           setProduct(foundProduct)
//           // Set default selected size to first available size
//           const availableSizes =
//             foundProduct.availableSizes || defaultSizes.filter((size) => !unavailableSizes.includes(size))
//           if (availableSizes.length > 0) {
//             setSelectedSize(availableSizes[0])
//           }
//         } else {
//           setError("Product not found")
//         }
//       } catch (err) {
//         setError("Failed to load product. Please try again later.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (productId) {
//       fetchProduct()
//     }
//   }, [productId])

//   const handleQuantityChange = (change: number) => {
//     setQuantity((prev) => Math.max(1, prev + change))
//   }

//   const handleSizeSelect = (size: string) => {
//     if (!unavailableSizes.includes(size)) {
//       setSelectedSize(size)
//     }
//   }

//   const handleAddToCart = () => {
//     if (!product || !selectedSize) return

//     const cartItem = {
//       id: product._id,
//       name: product.name,
//       price: product.price,
//       size: selectedSize,
//       quantity: quantity,
//       image: product.imageUrl,
//     }

//     setCart((prev) => [...prev, cartItem])
//     alert(`Added ${quantity} ${product.name} (${selectedSize}) to cart!`)
//   }

//   const getProductImages = () => {
//     if (!product) return []

//     // Use multiple images if available, otherwise use main image
//     if (product.images && product.images.length > 0) {
//       return product.images
//     }
//     return [product.imageUrl]
//   }

//   const getCurrentImage = () => {
//     const images = getProductImages()
//     return images[selectedImageIndex] || product?.imageUrl || "/placeholder.svg?height=550&width=450"
//   }

//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p>Loading product...</p>
//       </div>
//     )

//   if (error || !product)
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p>{error || "Product not found"}</p>
//       </div>
//     )

//   const productImages = getProductImages()
//   const availableSizes = product.availableSizes || defaultSizes

//   return (
//     <div className="px-5 lg:px-12 py-8 pb-32">
//       <div className="text-xs space-x-2 text-gray-800">
//         <Link href={"/"}>Home</Link>
//         <span className="font-semibold">&gt;</span>
//         <span>{product.name}</span>
//       </div>

//       <section className="mt-12">
//         <main className="grid md:grid-cols-2 gap-5 lg:gap-5 xl:gap-7 lg:container lg:mx-auto">
//           <div className="mx-auto z-20">
//             <div className="lg:block hidden">
//               <ReactImageMagnify
//                 {...{
//                   smallImage: {
//                     alt: product.name,
//                     isFluidWidth: false,
//                     width: 450,
//                     height: 550,
//                     src: getCurrentImage(),
//                   },
//                   largeImage: {
//                     src: getCurrentImage(),
//                     width: 1200,
//                     height: 1800,
//                   },
//                   enlargedImageContainerDimensions: {
//                     width: "200%",
//                     height: "100%",
//                   },
//                   isHintEnabled: true,
//                 }}
//               />
//             </div>

//             <div className="relative lg:hidden overflow-x-hidden">
//               <Zoom>
//                 <img src={getCurrentImage() || "/placeholder.svg"} alt={product.name} />
//               </Zoom>
//             </div>

//             {productImages.length > 1 && (
//               <div className="flex flex-wrap gap-3 mt-3 p-3">
//                 {productImages.map((image, index) => (
//                   <div
//                     key={index}
//                     className={`sm:w-28 w-24 h-32 sm:h-36 shrink-0 relative cursor-pointer ${
//                       selectedImageIndex === index ? "ring-2 ring-black" : ""
//                     }`}
//                     onClick={() => setSelectedImageIndex(index)}
//                   >
//                     <Image
//                       src={image || "/placeholder.svg"}
//                       fill
//                       alt={`${product.name} ${index + 1}`}
//                       sizes="100vw"
//                       className="w-full h-full object-cover"
//                       priority={index === 0}
//                     />
//                     {selectedImageIndex !== index && <div className="absolute inset-0 bg-white/30"></div>}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="flex flex-col px-0.5 gap-5 overflow-hidden break-all">
//             <div>
//               <p className="font-semibold text-xl">{product.name}</p>
//             </div>

//             <p className="text-gray-600 font-medium text-xs">{product.description}</p>

//             <div className="text-gray-600 font-medium mt-2 text-xs">
//               Availability: {product.inStock ? "In Stock" : "Out of Stock"}
//             </div>

//             <div className="font-bold mt-2 flex gap-2">
//               {product.originalPrice && (
//                 <span className="line-through">Rs.{product.originalPrice.toLocaleString()}</span>
//               )}
//               <span className="text-[#D12442]">Rs.{product.price.toLocaleString()}</span>
//             </div>

//             <div className="z-10">
//               <div className="text-gray-600 font-medium mb-3 text-xs">Size: {selectedSize}</div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 {availableSizes.map((size) => {
//                   const isUnavailable = unavailableSizes.includes(size)
//                   const isSelected = selectedSize === size

//                   return (
//                     <span
//                       key={size}
//                       onClick={() => handleSizeSelect(size)}
//                       className={`text-xs px-2 py-3 border relative overflow-hidden cursor-pointer transition-colors ${
//                         isSelected
//                           ? "border-black bg-black text-white"
//                           : isUnavailable
//                             ? "border-gray-300 text-gray-400 cursor-not-allowed"
//                             : "border-gray-300 hover:border-gray-500"
//                       }`}
//                     >
//                       {size}
//                       {isUnavailable && (
//                         <span className="absolute left-[-10%] top-1/2 w-[120%] h-[1px] bg-red-300 -rotate-45 -translate-y-1/2 pointer-events-none" />
//                       )}
//                     </span>
//                   )
//                 })}
//               </div>
//             </div>

//             <div
//               onClick={() => setShowSize(true)}
//               className="text-gray-600 font-medium flex hover:underline underline-offset-4 items-center gap-2 mt-2 text-xs cursor-pointer"
//             >
//               <RulerDimensionLine className="text-black" /> Size Guide
//             </div>

//             <div className="mt-7">
//               <span className="text-xs text-gray-600 font-medium mb-2">Quantity:</span>
//               <div className="flex sm:flex-row flex-col gap-5">
//                 <div className="font-bold gap-4 w-24 sm:w-28 justify-between px-1 py-3 flex border border-gray-300 items-center shrink-0">
//                   <span
//                     className="cursor-pointer text-gray-700 hover:text-black"
//                     onClick={() => handleQuantityChange(-1)}
//                   >
//                     <Minus size={20} />
//                   </span>
//                   <span className="text-xs text-gray-600 font-normal">{quantity}</span>
//                   <span
//                     className="cursor-pointer text-gray-700 hover:text-black"
//                     onClick={() => handleQuantityChange(1)}
//                   >
//                     <Plus size={20} />
//                   </span>
//                 </div>
//                 <Button
//                   onClick={handleAddToCart}
//                   disabled={!product.inStock || !selectedSize}
//                   className="bg-black py-2.5 grow text-sm sm:w-auto text-white font-semibold hover:bg-white hover:text-black hover:border-gray-400 hover:border disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 >
//                   <ShoppingCart size={16} />
//                   ADD TO CART
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </main>
//       </section>
//       <SizeGuide show={showSize} hide={setShowSize} />
//     </div>
//   )
// }

// export default ProductDetailsPage


"use client"
import SizeGuide from "@/app/components/sizeChart"
import { Button } from "@/components/ui/button"
import { Minus, Plus, RulerIcon as RulerDimensionLine, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type React from "react"
import { useState, useEffect } from "react"
import CustomImageMagnify from "./custom-image-magnifier"
import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  imageUrl: string
  images?: string[]
  sizes?: string[]
  availableSizes?: string[]
  inStock: boolean
  category?: string
}

interface ProductDetailsPageProps {
  productId: string
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ productId }) => {
  const [showSize, setShowSize] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [cart, setCart] = useState<any[]>([])

  // Default sizes if not provided by API
  const defaultSizes = ["Small", "Medium", "Large", "Extra Large"]
  const unavailableSizes = ["Small", "Extra Large"] // Mock unavailable sizes

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("https://677d93bc4496848554cb2350.mockapi.io/productsDetails/productDetails")
        const products = await response.json()

        // Find the specific product by ID
        const foundProduct = products.find((p: Product) => p._id === productId)

        if (foundProduct) {
          setProduct(foundProduct)
          // Set default selected size to first available size
          const availableSizes =
            foundProduct.availableSizes || defaultSizes.filter((size) => !unavailableSizes.includes(size))
          if (availableSizes.length > 0) {
            setSelectedSize(availableSizes[0])
          }
        } else {
          setError("Product not found")
        }
      } catch (err) {
        setError("Failed to load product. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change))
  }

  const handleSizeSelect = (size: string) => {
    if (!unavailableSizes.includes(size)) {
      setSelectedSize(size)
    }
  }

  const handleAddToCart = () => {
    if (!product || !selectedSize) return

    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity: quantity,
      image: product.imageUrl,
    }

    setCart((prev) => [...prev, cartItem])
    alert(`Added ${quantity} ${product.name} (${selectedSize}) to cart!`)
  }

  const getProductImages = () => {
    if (!product) return []

    // Use multiple images if available, otherwise use main image
    if (product.images && product.images.length > 0) {
      return product.images
    }
    return [product.imageUrl]
  }

  const getCurrentImage = () => {
    const images = getProductImages()
    return images[selectedImageIndex] || product?.imageUrl || "/placeholder.svg?height=550&width=450"
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading product...</p>
      </div>
    )

  if (error || !product)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>{error || "Product not found"}</p>
      </div>
    )

  const productImages = getProductImages()
  const availableSizes = product.availableSizes || defaultSizes

  return (
    <div className="px-5 lg:px-12 py-8 pb-32">
      <div className="text-xs space-x-2 text-gray-800">
        <Link href={"/"}>Home</Link>
        <span className="font-semibold">&gt;</span>
        <span>{product.name}</span>
      </div>

      <section className="mt-12">
        <main className="grid md:grid-cols-2 gap-5 lg:gap-5 xl:gap-7 lg:container lg:mx-auto">
          <div className="mx-auto z-20">
            <div className="lg:block hidden">
              <CustomImageMagnify src={getCurrentImage()} alt={product.name} width={450} height={550} />
            </div>

            <div className="relative lg:hidden overflow-x-hidden">
              <Zoom>
                <img src={getCurrentImage() || "/placeholder.svg"} alt={product.name} />
              </Zoom>
            </div>

            {productImages.length > 1 && (
              <div className="flex flex-wrap gap-3 mt-3 p-3">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    className={`sm:w-28 w-24 h-32 sm:h-36 shrink-0 relative cursor-pointer ${
                      selectedImageIndex === index ? "ring-2 ring-black" : ""
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      fill
                      alt={`${product.name} ${index + 1}`}
                      sizes="100vw"
                      className="w-full h-full object-cover"
                      priority={index === 0}
                    />
                    {selectedImageIndex !== index && <div className="absolute inset-0 bg-white/30"></div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col px-0.5 gap-5 overflow-hidden break-all">
            <div>
              <p className="font-semibold text-xl">{product.name}</p>
            </div>

            <p className="text-gray-600 font-medium text-xs">{product.description}</p>

            <div className="text-gray-600 font-medium mt-2 text-xs">
              Availability: {product.inStock ? "In Stock" : "Out of Stock"}
            </div>

            <div className="font-bold mt-2 flex gap-2">
              {product.originalPrice && (
                <span className="line-through">Rs.{product.originalPrice.toLocaleString()}</span>
              )}
              <span className="text-[#D12442]">Rs.{product.price.toLocaleString()}</span>
            </div>

            <div className="z-10">
              <div className="text-gray-600 font-medium mb-3 text-xs">Size: {selectedSize}</div>
              <div className="flex items-center gap-2 flex-wrap">
                {availableSizes.map((size) => {
                  const isUnavailable = unavailableSizes.includes(size)
                  const isSelected = selectedSize === size

                  return (
                    <span
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`text-xs px-2 py-3 border relative overflow-hidden cursor-pointer transition-colors ${
                        isSelected
                          ? "border-black bg-black text-white"
                          : isUnavailable
                            ? "border-gray-300 text-gray-400 cursor-not-allowed"
                            : "border-gray-300 hover:border-gray-500"
                      }`}
                    >
                      {size}
                      {isUnavailable && (
                        <span className="absolute left-[-10%] top-1/2 w-[120%] h-[1px] bg-red-300 -rotate-45 -translate-y-1/2 pointer-events-none" />
                      )}
                    </span>
                  )
                })}
              </div>
            </div>

            <div
              onClick={() => setShowSize(true)}
              className="text-gray-600 font-medium flex hover:underline underline-offset-4 items-center gap-2 mt-2 text-xs cursor-pointer"
            >
              <RulerDimensionLine className="text-black" /> Size Guide
            </div>

            <div className="mt-7">
              <span className="text-xs text-gray-600 font-medium mb-2">Quantity:</span>
              <div className="flex sm:flex-row flex-col gap-5">
                <div className="font-bold gap-4 w-24 sm:w-28 justify-between px-1 py-3 flex border border-gray-300 items-center shrink-0">
                  <span
                    className="cursor-pointer text-gray-700 hover:text-black"
                    onClick={() => handleQuantityChange(-1)}
                  >
                    <Minus size={20} />
                  </span>
                  <span className="text-xs text-gray-600 font-normal">{quantity}</span>
                  <span
                    className="cursor-pointer text-gray-700 hover:text-black"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus size={20} />
                  </span>
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || !selectedSize}
                  className="bg-black py-2.5 grow text-sm sm:w-auto text-white font-semibold hover:bg-white hover:text-black hover:border-gray-400 hover:border disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ShoppingCart size={16} />
                  ADD TO CART
                </Button>
              </div>
            </div>
          </div>
        </main>
      </section>
      <SizeGuide show={showSize} hide={setShowSize} />
    </div>
  )
}

export default ProductDetailsPage
