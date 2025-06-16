"use client"
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import ChevronUP from './chevronUP';
import { useRouter, useSearchParams } from 'next/navigation';
import useAppContext from '@/context/ContextAPI';


 
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
  images?: string[];
  category?: string;
  tags?: string[];
}
export default function AsideBarForSearchPage({
  tags,
  products,
  selectedCategories,
  setSelectedCategories,
  minPrice,
  maxPrice,
  priceRange,
  setPriceRange,
}: {
  tags: string[];
  products: Product[];
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  minPrice: number;
  maxPrice: number;
  priceRange: [number, number];
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
}) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const { searchTerm, setSearchTerm, setSearchCategories } = useAppContext();

        const [caUp,setCaUp] = useState(true)
        const [priceUp,setPriceUp] = useState(true)
        const [activeFilter,setActiveFilter] = useState(true)

        useEffect(() => {
          setSelectedCategories([]);
          setSearchCategories([]);
        }, [searchTerm]);

  useEffect(() => {
    const searchParam = searchParams.get("search");
    const categoryParam = searchParams.get("category");

    if (searchParam) {
      setSearchTerm(searchParam);
    }

    if (categoryParam) {
      const categories = categoryParam.split(",");
      setSelectedCategories(categories);
      setSearchCategories(categories);
    }
  }, [searchParams, setSearchTerm, setSearchCategories]);

  useEffect(() => {
    if (
      minPrice &&
      maxPrice &&
      (minPrice !== priceRange[0] || maxPrice !== priceRange[1])
    ) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [minPrice, maxPrice]);

  
  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(newCategories);
    setSearchCategories(newCategories);

    // Update URL parameters
    const params = new URLSearchParams(searchParams.toString());
    if (newCategories.length > 0) {
      params.set("category", newCategories.join(","));
    } else {
      params.delete("category");
    }

    router.push(`/search?${params.toString()}`, { scroll: false });
  };


 
  

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchCategories([]);
    setSearchTerm("");

    const params = new URLSearchParams(window.location.search);

    params.forEach((_, key) => {
      if (key !== "search") params.delete(key);
    });

    window.location.href = `/search?${params.toString()}`;

  };  
  return (
    <aside className="col-span-3 text-xs px-2 lg:block hidden">
      <div className="col-span-3 pb-20 hidden lg:block">
        <div className=" pt-6">
          <div
            onClick={() => setActiveFilter(!activeFilter)}
            className="flex mb-8 cursor-pointer border-b font-bold pb-4 border-black items-center gap-3 justify-between"
          >
            <h3 className="  uppercase">Filter By</h3>
            <span className={`${activeFilter? "" : "rotate-180"} duration-500`}>
              <ChevronUP />
            </span>
          </div>
          {/* Active Filters Display */}
          {selectedCategories.length > 0 && products.length > 0 && (
             <div
             className={`space-y-2 flex flex-col gap-3 overflow-hidden transition-all ease-in-out  duration-500  ${
               activeFilter ? "max-h-[1400px] mt-5 mb-6 " : "max-h-0 "
             } `}
           >
            <div
            className={`space-y-2 flex flex-col gap-3 overflow-hidden  ${
              activeFilter ? "max-h-[1400px] mt-5 mb-8 " : "max-h-0 "
            } `}
          >

            <div className="mb-7 p-3 bg-green-50 rounded-lg">
              <h3 className="font-medium text-sm text-green-800">
                Active Filters
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCategories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                  >
                    {category}
                    <button
                      onClick={() => toggleCategory(category)}
                      className="text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>   
            </div>   
            </div>   
          )}

          {/* Categories */}
          <div className="">
            <div
              onClick={() => setCaUp(!caUp)}
              className="flex mb-8 cursor-pointer border-b font-bold pb-4 border-black items-center gap-3 justify-between"
            >
              <h3 className="  uppercase">Categories</h3>
              <span className={`${caUp ? "" : "rotate-180"} duration-500`}>
                <ChevronUP />
              </span>
            </div>
            <div
              className={`space-y-2 flex flex-col gap-3 overflow-hidden transition-all ease-in-out  duration-500  *:hover:translate-x-4 *:duration-300 ${
                caUp ? "max-h-[1400px] mt-5 mb-8 " : "max-h-0 "
              } `}
            >
              {/* {["Men", "Women", "Kids", "Perfume"].map((category) => ( */}
              {tags.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`desktop-${category}`}
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="h-4 w-4 rounded accent-black border-gray-300"
                  />
                  <label htmlFor={`desktop-${category}`} className="text-sm">
                    {category}
                    {/* <span className="text-gray-400 ml-1">
                      (
                      {
                        products.filter((p: Product) =>
                          p.tags?.includes(category)
                        ).length
                      }
                      )
                    </span> */}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <div
              onClick={() => setPriceUp(!priceUp)}
              className="flex mb-6 cursor-pointer border-b font-bold pb-4 border-black items-center gap-3 justify-between"
            >
              <h3 className="uppercase">Price Range</h3>
              <span
                className={`${priceUp ? "rotate-0" : "rotate-180"} duration-500`}
              >
                <ChevronUP />
              </span>
            </div>
            <div
              className={`mt-6 space-y-4
         ${
           priceUp ? "max-h-[400px]  pt-3 mb-8 " : "max-h-0"
         } overflow-hidden transition-all ease-in-out  duration-500`}
            >
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                // step={100}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([
                    priceRange[0],
                    Number.parseInt(e.target.value),
                  ])
                }
                className="w-full accent-black "
              />
              <div className="flex justify-between text-sm mt-2">
                <span>Rs.{priceRange[0].toLocaleString()}</span>
                <span>Rs.{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>
          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 underline underline-offset-2"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </aside>
  );
}
