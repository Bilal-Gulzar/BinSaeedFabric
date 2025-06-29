"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import useAppContext from "@/context/ContextAPI";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import ProductDetailSkeleton from "@/app/components/ProductDetailSkeleton";
import ReactImageMagnify from "react-image-magnify";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  qty: number;
  isNew: boolean;
  originalPrice?: number;
  imageUrl: string;
  productImages?: string[] | [];
  category?: string;
  tags?: string[];
  sizes?: string[];
}

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const productSlug = params.slug as string;
  const { addToCart, setCart } = useAppContext();

  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [availableSizes,setAvailableSizes] = useState<string[]>([]);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Available sizes
  const All_sizes = ["Small", "Medium", "Large", "Extra Large"];
  // const unavailableSizes = ["Small", "Extra Large"];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // console.log("Fetching product with slug:", productSlug);
        const query = `*[_type == "product" && _id == $id][0]{
          title, 
          price, 
          tags[], 
          _id,
          isNew,
          qty,
          originalPrice,
          sizes[],
          description, 
          "imageUrl": thumbnail.asset -> url,
         productImages[] {
    asset->{
      url
    }
  }
        }`;

        // Fetch single product with parameters
        const foundProduct:Product = await client.fetch(query, { id: productSlug });
        // console.log("Found product:", foundProduct.sizes);
        // console.log("Found product:", foundProduct);
        if (foundProduct) {
          setProduct(foundProduct);
          // setSelectedSize(foundProduct?.sizes[0] || null);
          setAvailableSizes(foundProduct?.sizes || []);
          setMainImage(foundProduct?.imageUrl)
          setImages(foundProduct?.productImages || [])
        } else {
          console.error("Product not found with slug:", productSlug);
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (productSlug) {
      fetchProduct();
    }
  }, [productSlug]);

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  useEffect(() => {
    if (availableSizes && availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
    }
  }, [availableSizes]);

  const handleAddToCart = () => {

    if (!product) return toast.error("something went wrong");
    if(availableSizes && availableSizes.length > 0) {
      if(!selectedSize){
        toast.error("Please select size!")
        return 
      }
    }

    // Add item to cart with correct quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product._id,
        name: product.title,
        price: product.price,
        stock:product.qty,
        originalPrice: product.originalPrice,
        imageUrl: product.imageUrl,
        size: selectedSize ,
      });
    }

    toast.success(`Added ${quantity} ${product.title} ${availableSizes.length >0 ? `(${selectedSize})` : ""} to cart!`);
    setTimeout(()=>{
      setCart(true); // Open the cart sidebar

    },1000)

    // Reset quantity to 1 after adding
    setQuantity(1);
  };

  // const getProductImages = () => {
  //   if (!product) return [];

  //   if (product.imageUrl && product.images.length > 0) {
  //     return product.images;
  //   }

  //   return [product.imageUrl];
  // };

  // const getCurrentImage = () => {
  //   const images = getProductImages();
  //   return images[selectedImageIndex] || "/placeholder.svg";
  // };

  // Show skeleton while loading
  if (loading) return <ProductDetailSkeleton />;

  if (error || !product)
    return (
      <div className="p-8 text-center text-red-500">
        {error || "Product not found"}
      </div>
    );

  return (
    <div className="px-5 lg:px-12 py-8 pb-32">
      <div className="text-xs space-x-2 text-gray-800">
        <Link href="/">Home</Link>
        <span className="font-semibold">&gt;</span>
        <span>{product.title}</span>
      </div>

      <section className="mt-12">
        <main className="grid md:grid-cols-2 gap-5 lg:gap-5 xl:gap-7 lg:container lg:mx-auto">
          {/* Product Images */}
          <div className="mx-auto z-20">
            {/* <div className="relative w-full h-[550px]">
              <Image
                src={
                  product.imageUrl
                    ? urlFor(product.imageUrl).url()
                    : "/placeholder.svg"
                }
                alt={`${product.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div> */}
            <div className="lg:block  hidden">
              <ReactImageMagnify
                {...{
                  smallImage: {
                    alt: "Product",
                    isFluidWidth: false,
                    width: 450, // 👈
                    height: 550,
                    src: mainImage || "/placeholder.svg",
                  },
                  largeImage: {
                    src: mainImage || "/placeholder.svg",
                    width: 1200,
                    height: 1800,
                  },
                  enlargedImageContainerDimensions: {
                    width: "200%",
                    height: "100%",
                  },
                  isHintEnabled: true,
                }}
              />
            </div>
            <div className=" lg:hidden overflow-x-hidden">
              <Zoom>
                <img src={mainImage} className="mx-auto" />
              </Zoom>
            </div>

            {images && images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3 p-3">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`sm:w-28 w-24 h-32 sm:h-36 shrink-0 bg-gray-100 rounded-md relative  cursor-pointer ${
                      selectedImageIndex === index
                        ? " border border-gray-800 ring-0  "
                        : ""
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={image ? urlFor(image).url() : "/placeholder.svg"}
                      fill
                      alt={`${product.title} ${index + 1}`}
                      sizes="100px"
                      className={`object-cover  ${
                        selectedImageIndex === index ? "rounded-md" : ""
                      }`}
                      onClick={() => setMainImage(urlFor(image).url())}
                    />
                    {selectedImageIndex == index && (
                      <div
                        className={`absolute inset-0 border-0  ${
                          selectedImageIndex === index ? "rounded-md" : ""
                        } bg-white/60`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col px-0.5 gap-5 overflow-hidden break-all">
            <div>
              <p className="font-semibold text-xl">{product.title}</p>
            </div>

            <p className="text-gray-600 font-medium text-xs">
              {product.description}
            </p>

            {product.qty > 0 ? (
              <div className="text-gray-600 font-medium mt-2 text-xs">
                Availability: In Stock
              </div>
            ) : (
              <div className="text-gray-600 font-medium mt-2 text-xs">
                Availability:{" "}
                <span className="text-[#D12442]">out of Stock</span>
              </div>
            )}
            <div className="font-bold mt-2 flex gap-2">
              {product.originalPrice && (
                <span className="line-through">
                  Rs.{product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-[#D12442]">
                Rs.{product.price.toLocaleString()}
              </span>
            </div>

            {/* Tags Display */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Size Selection */}
            <div className="z-10">
              <div className="text-gray-600 font-medium mb-3 text-xs">
                Size: {selectedSize}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {All_sizes.map((size, index) => {
                  const isAvailable = availableSizes.includes(size);
                  const isSelected = selectedSize === size;

                  return (
                    <button
                      key={index}
                      disabled={!isAvailable}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      className={`text-xs px-2 py-3 border relative overflow-hidden cursor-pointer transition-colors ${
                        isSelected
                          ? "border-black bg-black text-white"
                          : !isAvailable
                            ? "border-gray-300 text-gray-400 !cursor-not-allowed"
                            : "border-gray-300 hover:border-gray-500"
                      }`}
                    >
                      {size}
                      {!isAvailable && (
                        <span className="absolute left-[-10%] top-1/2 w-[120%] h-[1px] bg-red-300 -rotate-45 -translate-y-1/2 pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Guide */}
            <div
              onClick={() => setShowSizeGuide(true)}
              className="text-gray-600 font-medium w-fit flex hover:underline underline-offset-4 items-center gap-2 mt-2 text-xs cursor-pointer"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 22h20"></path>
                <path d="M6 18v4"></path>
                <path d="M18 18v4"></path>
                <path d="M6 10V2h12v8"></path>
                <path d="M2 10h20"></path>
              </svg>
              Size Guide
            </div>

            {/* Quantity and Add to Cart */}
            <div className="mt-7">
              <span className="text-xs text-gray-600 font-medium mb-2">
                Quantity:
              </span>
              <div className="flex sm:flex-row flex-col gap-5">
                <div className="font-bold gap-4 w-24 sm:w-28 justify-between px-1 py-3 flex border border-gray-300 items-center shrink-0">
                  <span
                    className="cursor-pointer text-gray-700 hover:text-black"
                    onClick={() => handleQuantityChange(-1)}
                  >
                    <Minus size={20} />
                  </span>
                  <span className="text-xs text-gray-600 font-normal">
                    {quantity}
                  </span>
                  <span
                    className="cursor-pointer text-gray-700 hover:text-black"
                    onClick={() => {
                      if (product.qty > quantity) {
                        handleQuantityChange(1);
                      }
                    }}
                  >
                    <Plus size={20} />
                  </span>
                </div>
                <button
                  disabled={product.qty == 0}
                  onClick={handleAddToCart}
                  className="bg-black py-2.5 px-4 grow cursor-pointer disabled:bg-black/50 disabled:hover:text-white text-sm sm:w-auto text-white font-semibold hover:bg-white hover:text-black hover:border-gray-400 hover:border border border-transparent flex items-center gap-2 justify-center"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </main>
      </section>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Size Guide</h2>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-3 text-left">
                        Size
                      </th>
                      <th className="border border-gray-300 p-3 text-left">
                        Chest (inches)
                      </th>
                      <th className="border border-gray-300 p-3 text-left">
                        Waist (inches)
                      </th>
                      <th className="border border-gray-300 p-3 text-left">
                        Length (inches)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3">Small</td>
                      <td className="border border-gray-300 p-3">34-36</td>
                      <td className="border border-gray-300 p-3">28-30</td>
                      <td className="border border-gray-300 p-3">26-27</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Medium</td>
                      <td className="border border-gray-300 p-3">38-40</td>
                      <td className="border border-gray-300 p-3">32-34</td>
                      <td className="border border-gray-300 p-3">27-28</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Large</td>
                      <td className="border border-gray-300 p-3">42-44</td>
                      <td className="border border-gray-300 p-3">36-38</td>
                      <td className="border border-gray-300 p-3">28-29</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">
                        Extra Large
                      </td>
                      <td className="border border-gray-300 p-3">46-48</td>
                      <td className="border border-gray-300 p-3">40-42</td>
                      <td className="border border-gray-300 p-3">29-30</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 text-sm text-gray-600">
                <h3 className="font-semibold mb-2">How to Measure:</h3>
                <ul className="space-y-1">
                  <li>
                    • <strong>Chest:</strong> Measure around the fullest part of
                    your chest
                  </li>
                  <li>
                    • <strong>Waist:</strong> Measure around your natural
                    waistline
                  </li>
                  <li>
                    • <strong>Length:</strong> Measure from shoulder to desired
                    length
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
