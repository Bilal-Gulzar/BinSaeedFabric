"use client"
import React, { useEffect, useState } from 'react'
import InfiniteScrollingtLoading from '../components/infiniteScrollingtLoading';
import Image from 'next/image';
import AsideBarForSearchPage from '../components/AsideBarForSearchPage';
import AsidBarToggle from '../components/asidBarToggle';
import { client } from '@/sanity/lib/client';
import { useSearchParams } from 'next/navigation';
import SearchNotFound from '../components/searchNotFound';
import Link from 'next/link';
import ProductGridSkeleton from '../components/ProductGridSkeleton';


interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  qty: number;
  isNew: boolean;
  discountPercentage: number;
  originalPrice?: number;
  imageUrl: string;
  tags?: string[];
  sizes?: string[];
}
export default function Search() {
  const [toggle, setToggle] = useState<Boolean>(false);
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(queryFromUrl);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [allTags, setAllTags] = useState<string[]>([]);
 const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
 const [minPrice, setMinPrice] = useState(0);
 const [filteredResults, setFilteredResults] = useState<Product[]>([]); 
 const [maxPrice, setMaxPrice] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const categoryParam = searchParams.get("category") || "";
  const [error, setError] = useState<string | null>(null)
  
  const categoryTags = categoryParam
    ? categoryParam.split(",").map((tag) => tag.trim())
    : [];
  // Sync searchTerm with URL query param if URL changes
  useEffect(() => {
    setSearchTerm(queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    if (!searchTerm.trim() && categoryTags.length === 0) {
      setResults([]);
      setAllTags([]);
      return;
    }

    const categoryFilter = categoryTags.length
      ? `&& count((tags)[@ in $categories]) > 0`
      : "";
    // setLoading(true);

    const query = `*[_type == "product" && 
    (title match $term || description match $term || tags[] match $term)
    ${categoryFilter}
  ]{
    title,
    price,
    tags[],
    _id,
    isNew,
    qty,
    sizes[],
    originalPrice,
    description,
    "imageUrl": thumbnail.asset->url,
  }`;
    client
      .fetch(query, { term: `*${searchTerm}*`, categories: categoryTags })
      .then((data) => {
        setResults(data);
        setLoading(false);
        // Extract unique tags from data
        const tags = data.flatMap((item: Product) => item.tags || []);
        // const uniqueTags = Array.from(new Set(tags));
        const uniqueTags = [...new Set(tags)] as string[];
        setAllTags(uniqueTags);


      })
      .catch((error) => {
        console.error("Sanity fetch error:", error);
        setError("Failed to load products")
        setLoading(false);
        setAllTags([]);
      });
  }, [searchTerm, selectedCategories]);

  useEffect(() => {
    if (results.length === 0) return;

    const prices = results
      .map((p) => p.price)
      .filter((price): price is number => typeof price === "number");

    if (prices.length > 0) {
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setMinPrice(min);
      setMaxPrice(max);
      setPriceRange((prev) => {
        // Only update if changed to prevent loop
        if (prev[0] !== min || prev[1] !== max) {
          return [min, max];
        }
        return prev;
      })
      // setResults(products);
      setFilteredResults(results);

    }
  }, [results]);

  useEffect(() => {
    const filtered = results.filter(
      (p) =>
        p.price !== undefined &&
        p.price >= priceRange[0] &&
        p.price <= priceRange[1]
    );
    // console.log(priceRange)
    setFilteredResults(filtered);

  }, [priceRange, results]);


//  Show skeleton while loading
  if (loading) {
    return (
      <div className="max-w-[1500px] mx-auto min-h-screen">
        <div className="px-5 lg:px-12 mt-12 lg:grid lg:grid-cols-12 gap-6">
          {/* Sidebar Skeleton - Desktop */}
          <div className="col-span-3 hidden lg:block">
            <div className="b pt-6 space-y-6">
              <div className="h-6 w-24 bg-gray-300 animate-pulse rounded"></div>
              <div className="space-y-4">
                <div className="h-4 w-20 bg-gray-300 animate-pulse rounded"></div>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className="h-4 w-4 bg-gray-300 animate-pulse rounded"></div>
                      <div className="h-4 w-16 bg-gray-300 animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="col-span-9">
            <div className="flex py-12  items-center justify-between">
              <div className="h-6 w-16 bg-gray-300 animate-pulse rounded lg:hidden"></div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-20 bg-gray-300 animate-pulse rounded hidden lg:block"></div>
                <div className="flex gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 bg-gray-300 animate-pulse rounded border"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="h-6 w-24 bg-gray-300 animate-pulse rounded"></div>
            </div>

            {/* Products Grid Skeleton */}
            <ProductGridSkeleton gridCols={3} itemCount={8} />
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="p-8 text-center text-red-500">{error}</div>

  return (
    <div>
      {!searchTerm.trim() ? (
        <div className="text-xl mt-10 h-[70vh] uppercase text-center font-bold">
          Please enter a search term
        </div>
      ) : (
        <div>
          <div className="lg:grid px-5 lg:px-12 lg:grid-cols-12 gap-6 mt-12">
            <AsideBarForSearchPage
              tags={allTags}
              products={filteredResults}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              minPrice={minPrice}
              maxPrice={maxPrice}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
            <div className="col-span-9 text-xs pb-12 ">
              {searchTerm.length > 0 && results.length == 0 && (
                <SearchNotFound text={searchTerm} />
              )}

              <div className="">
                {searchTerm && results.length > 0 && (
                  <div className="text-xl  uppercase text-center font-bold">
                    {/* 1717 results found for “new” */}
                    {results.length} results found for “{searchTerm}”
                  </div>
                )}
                {searchTerm && results.length > 0 && (
                  <div
                    onClick={() => setToggle(true)}
                    className="lg:hidden flex items-center mt-7  gap-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-funnel-icon lucide-funnel"
                    >
                      <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
                    </svg>
                  </div>
                )}
                <div
                  className={`grid grid-cols-1 xs:grid-cols-2  pb-20 lg:grid-cols-3 mt-10 gap-5 sm:gap-7 md:gap-10`}
                  style={{ width: "100%", height: "100%" }}
                >
                  {filteredResults &&
                    filteredResults.map((item: Product) => (
                      <div
                        key={item._id}
                        className="text-xs text-center relative  mb-3 space-y-1.5"
                      >
                        <Link href={`/collection/${item._id}`}>
                          <div className="bg-gray-100">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.title}
                                width={400}
                                height={400}
                                className="img-slider-img "
                              />
                            ) : (
                              <div className="flex justify-center items-center h-full w-full  bg-gray-200">
                                <p className="text-gray-500 ">
                                  No image available
                                </p>
                              </div>
                            )}
                          </div>
                        </Link>
                        <div className="hover:underline  mt-3 underline-offset-4 text-gray-700 font-medium">
                          {item.title}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-3 items-center justify-center">
                          {item.originalPrice ? (
                            <span className="text-[#D12442] font-bold text-sm">
                              Rs.{item.price}
                            </span>
                          ) : (
                            <span className="font-bold text-sm">
                              Rs.{item.price}
                            </span>
                          )}
                          {item.originalPrice && (
                            <div className="font-semibold text-sm line-through">
                              Rs.{item.originalPrice}
                            </div>
                          )}
                        </div>
                        {item.isNew && (
                          <div className="absolute top-1 sm:top-3 left-0 font-medium  text-[9px] sm:text-xs text-white bg-[#ffbb49]  sm:py-1 sm:px-2 px-1 py-0.5">
                            New In
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
              {/* <InfiniteScrollingtLoading /> */}
            </div>
          </div>
          <AsidBarToggle
            toggle={toggle}
            setToggle={setToggle}
            tags={allTags}
            products={filteredResults}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            minPrice={minPrice}
            maxPrice={maxPrice}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </div>
      )}
    </div>
  );
}
