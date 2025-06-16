"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  TfiLayoutColumn3Alt,
  TfiLayoutColumn2Alt,
  TfiLayoutColumn4Alt,
} from "react-icons/tfi";
import { IoChevronDownOutline } from "react-icons/io5";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { useRouter, useSearchParams } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import useAppContext from "@/context/ContextAPI";
import ProductGridSkeleton from "@/app/components/ProductGridSkeleton";
import InfiniteScrollingtLoading from "../components/infiniteScrollingtLoading";
import NoMoreProduct from "../components/NoMoreProduct";

type GridSize = 1 | 2 | 3 | 4;

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  qty: number;
  isNew: boolean;
  originalPrice?: number;
  imageUrl: string;
  productImages?: string[];
  category?: string;
  tags?: string[];
}

export default function CollectionPage() {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement | null>(null);

  const searchParams = useSearchParams();
  const { searchTerm, setSearchTerm, setSearchCategories } = useAppContext();

  // Basic UI state
  const [gridCols, setGridCols] = useState<GridSize>(2);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  // const [higestPrice, setHigestPrice] = useState<number>(0);
  const [minAllowed, setMinAllowed] = useState<number>(0);
  const [maxAllowed, setMaxAllowed] = useState<number>(1000);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([1000, 5000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [inset, setInset] = useState(false);
  const [sortOption, setSortOption] = useState("featured");
  const [applySort, setApplySort] = useState("featured");
  // console.log(applySort,"applySort")
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filtersActive =
    selectedCategories.length > 0 ||
    inStockOnly ||
    priceRange[0] !== minAllowed ||
    priceRange[1] !== maxAllowed;


  const fetchProductCount = async () => {
    let filterQuery = "";

    if (filtersActive) {
      const filters = [];

      if (selectedCategories.length > 0) {
        const catList = selectedCategories.map((cat) => `"${cat}"`).join(",");
        filters.push(`count(tags[@ in [${catList}]]) > 0`);
      }

      if (priceRange) {
        filters.push(`price >= ${priceRange[0]} && price <= ${priceRange[1]}`);
      }

      if (inStockOnly) {
        filters.push(`qty > 0`);
      }

      filterQuery = filters.length > 0 ? ` && ${filters.join(" && ")}` : "";
    }

    const countQuery = `count(*[_type == "product"${filterQuery}])`;
    const count = await client.fetch<number>(countQuery);
    setTotalCount(count);
  };

  // Initialize filters from URL parameters
  useEffect(() => {
    const searchParam = searchParams.get("search");
    const categoryParam = searchParams.get("category");

    // if (searchParam) {
    //   setSearchTerm(searchParam)
    // }

    if (categoryParam) {
      const categories = categoryParam.split(",");
      setSelectedCategories(categories);
      setSearchCategories(categories);
    }
  }, [searchParams, setSearchCategories]);

  // Fetch filtered products paginated
  const fetchPaginatedFilteredProducts = async (
    page: number,
    limit = 10,
    sortOption = ""
  ) => {
    const start = (page - 1) * limit;
    const end = start + limit;

    const filters = [];

    if (selectedCategories.length > 0) {
      const categoryFilter = selectedCategories
        .map((cat) => `"${cat}"`)
        .join(",");
      filters.push(`count(tags[@ in [${categoryFilter}]]) > 0`);
    }
    if (priceRange) {
      filters.push(`price >= ${priceRange[0]} && price <= ${priceRange[1]}`);
    }
    if (inStockOnly) {
      filters.push(`qty > 0`);
    }

    const whereClause = filters.length ? ` && ${filters.join(" && ")}` : "";
    const sortOrder = getSortOrder(sortOption);

    const query = `*[_type == "product"${whereClause}] | order(${sortOrder})[${start}...${end}] {
    title, price, tags[], _id, isNew, qty, originalPrice, description,
    "imageUrl": thumbnail.asset->url,
    productImages[] { asset->{ url } }
  }`;

    return await client.fetch(query);
  };
  // Fetch products on mount
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       min_max_price()
  //       const tags = await client.fetch(`*[_type == "product"].tags[]`);
  //       const uniqueTags = [...new Set(tags)] as string[];
  //       setTags(uniqueTags);
  //       const response =
  //         await client.fetch(`*[_type == "product"] | order(_createdAt desc) {
  //        title,
  //         price,
  //         tags[],
  //         _id,
  //         isNew,
  //         qty,
  //         originalPrice,
  //         description,
  //         "imageUrl": thumbnail.asset->url,
  //        productImages[] {
  //   asset->{
  //     url
  //   }
  // }
  //       }`);
  //       // console.log("Fetched products:", response)
  //       setProducts(response)
  //     } catch (err) {
  //       console.error("Error fetching products:", err)
  //       setError("Failed to load products")
  //     } finally {
  //       setLoading(false)
  //     }

  //   }

  //   fetchProducts()
  // }, [])

  const fetchPaginatedProducts = async (
    page: number,
    limit: number = 10,
    sortOption = ""
  ) => {
    const start = (page - 1) * limit;
    const end = start + limit;
    const sortOrder = getSortOrder(sortOption);
    return await client.fetch(
      `*[_type == "product"] | order(${sortOrder})[${start}...${end}] {
        title, 
        price, 
        tags[], 
        _id,
        isNew,
        qty,
        originalPrice, 
        description, 
        "imageUrl": thumbnail.asset->url,
        productImages[] {
          asset->{ url }
        }
      }`
    );
  };

  // const loadMore = async () => {
  //   await new Promise((resolve) => setTimeout(resolve, 1500));
  //   try {
  //     await fetchProductCount();
  //     const newProducts: Product[] = await fetchPaginatedProducts(page);
  //     if (newProducts.length === 0) {
  //       setHasMore(false);
  //     } else {
  //       setProducts((prev) => [...prev, ...newProducts]);
  //       setPage((prev) => prev + 1);
  //     }

  //     const newTags = newProducts.flatMap((p) => p.tags || []);
  //     setTags((prevTags) => {
  //       const combined = [...prevTags, ...newTags];
  //       return [...new Set(combined)]; // unique tags only
  //     });
  //   } catch (err) {
  //     console.error("Error fetching more products:", err);
  //     setError("Failed to load products");
  //     setHasMore(false);
  //   }
  // };

  // // Default paginated fetch (no filters)
  // const fetchPaginatedProducts = async (page: number, limit = 10) => {
  //   const start = (page - 1) * limit;
  //   const end = start + limit;
  //   const query = `*[_type == "product"] | order(_createdAt desc)[${start}...${end}] {
  //     title, price, tags[], _id, isNew, qty, originalPrice, description,
  //     "imageUrl": thumbnail.asset->url,
  //     productImages[] { asset->{ url } }
  //   }`;

  //   return await client.fetch(query);
  // };

  const loadMore = async () => {
    // if (!hasMore) return;
    await new Promise((resolve) => setTimeout(resolve, 800));
    try {
      const nextPage = page;
      let newProducts: Product[] = [];

      if (filtersActive) {
        newProducts = await fetchPaginatedFilteredProducts(
          nextPage,
          undefined,
          sortOption
        );
      } else {
        newProducts = await fetchPaginatedProducts(nextPage, 10, sortOption);
        const newTags = newProducts.flatMap((p) => p.tags || []);
        setTags((prevTags) => {
          const combined = [...prevTags, ...newTags];
          return [...new Set(combined)]; 
        });
      }

      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) => [...prev, ...newProducts]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Failed to load more products", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  async function AllowInset() {
    setInset(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setInset(false);
  }


 
  useEffect(() => {
    // Reset products & page when filters change
    const fetchInitial = async () => {
      setHasMore(true);
      fetchProductCount();

      setPage(1);

      try {
        let initialProducts: Product[] = [];

        if (filtersActive) {
          initialProducts = await fetchPaginatedFilteredProducts(
            1,
            undefined,
            sortOption
          );
          setTags((prevTags) => {
            const combined = [...prevTags, ...selectedCategories];
            return [...new Set(combined)]; // unique tags only
          });
        } else {
          initialProducts = await fetchPaginatedProducts(
            1,
            undefined,
            sortOption
          );
        }

        setProducts(initialProducts);
        setPage(2);
        setHasMore(initialProducts.length > 0);
      } catch (err) {
        console.error("Failed to fetch products", err);
        setProducts([]);
        setHasMore(false);
      } finally {
        await new Promise((r) => setTimeout(r, 2000));
        setLoading(false);
      }
    };
    fetchInitial();
  }, [selectedCategories, priceRange, inStockOnly, sortOption]);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        min_max_price();
        // setProducts([]);
        await fetchProductCount();
        // const tags = await client.fetch(`*[_type == "product"].tags[]`);
        // const uniqueTags = [...new Set(tags)] as string[];
        // setTags(uniqueTags);
        const initialProducts: Product[] = await fetchPaginatedProducts(
          1,
          undefined,
          sortOption
        );

        // setProducts(initialProducts);
        const initialTags: string[] = initialProducts.flatMap(
          (p) => p.tags || []
        );
        const uniqueTags: string[] = [...new Set(initialTags)];
        setTags(uniqueTags);

        setPage(2); // Next page

      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        await new Promise((r)=>setTimeout((r),1000))
        setLoading(false);
      }
    };

    fetchInitial();
  }, []);

  const progress = totalCount
    ? Math.min((products.length / totalCount) * 100, 100)
    : 0;

  async function min_max_price() {
    const highest_Price = await client.fetch(
      `*[_type == "product"] | order(price desc)[0].price`
    );
    setMaxAllowed(highest_Price);

    const minPrice: number = await client.fetch(
      `*[_type == "product"] | order(price asc)[0].price`
    );
    setPriceRange([minPrice, highest_Price]);

    setMinAllowed(minPrice);
  }

  useEffect(() => {
    if (!modalRef.current) return;

    if (isFilterOpen || isSortOpen) {
      disableBodyScroll(modalRef.current);
    } else {
      enableBodyScroll(modalRef.current);
    }

    return () => {
      if (modalRef.current) enableBodyScroll(modalRef.current);
    };
  }, [isFilterOpen, isSortOpen]);

  const productHasCategory = (
    product: Product,
    categories: string[]
  ): boolean => {
    if (!product.tags || product.tags.length === 0) return false;
    return categories.some((category) => product.tags?.includes(category));
  };

  const getProductCategory = (product: Product): string | null => {
    if (!product.tags || product.tags.length === 0) return null;
    const categoryTags = ["Men", "Women", "Kids", "Perfume"];
    return product.tags.find((tag) => categoryTags.includes(tag)) || null;
  };

  // Filter products based on current filters and search
  // const filteredProducts = products.filter((product) => {
  //   // Category filter - check if product tags include any selected categories
  //   if (selectedCategories.length > 0) {
  //     if (!productHasCategory(product, selectedCategories)) {
  //       return false;
  //     }
  //   }

  //   // Price filter
  //   if (product.price < priceRange[0] || product.price > priceRange[1]) {
  //     return false;
  //   }

  //   // In stock filter (mock implementation)
  //   if (inStockOnly && product.tags?.includes("OutOfStock")) {
  //     return false;
  //   }
  //   if (inStockOnly && !product.qty) {
  //     return false;
  //   }

  //   return true;
  // });

  // Sort products
  // const sortedProducts = [...products].sort((a, b) => {
  //   switch (sortOption) {
  //     case "A-Z":
  //       return a.title.localeCompare(b.title);
  //     case "Z-A":
  //       return b.title.localeCompare(a.title);
  //     case "PriceL":
  //       return a.price - b.price;
  //     case "PriceH":
  //       return b.price - a.price;
  //     default:
  //       return 0;
  //   }
  // });

  const getSortOrder = (sortOption: string = "featured") => {
    switch (sortOption) {
      case "A-Z":
        return "title asc";
      case "Z-A":
        return "title desc";
      case "PriceL":
        return "price asc";
      case "PriceH":
        return "price desc";
      case "dateO":
        return "_createdAt asc";
      case "dateN":
      case "featured":
      default:
        return "_createdAt desc"; // Default to "new to old" or featured
    }
  };

  // Grid class based on selected columns
  const getGridClass = () => {
    switch (gridCols) {
      case 1:
        return "";
      case 2:
        return "grid-cols-1 xs:grid-cols-2";
      case 3:
        return "grid-cols-1 xs:grid-cols-2 md:grid-cols-3";
      case 4:
        return "grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      default:
        return "grid-cols-1 xs:grid-cols-2";
    }
  };

  // Toggle category selection and update URL
  const toggleCategory = async (category: string) => {
    await AllowInset();
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

    router.push(`/collection?${params.toString()}`, { scroll: false });
  };

  // Clear all filters
  const clearFilters = () => {
    min_max_price();
    setSelectedCategories([]);
    setInStockOnly(false);
    setSearchCategories([]);

    // Clear URL parameters
    router.push("/collection", { scroll: false });
  };

  const handleStock = async () => {
    setIsFilterOpen(false);
    setInset(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setInset(false);

    setInStockOnly(!inStockOnly);
  };

  // Show skeleton while loading
  if (loading) {
    return (
      <div className="max-w-[1500px] relative mx-auto min-h-screen">
        {/* Breadcrumb */}
        <div className="text-xs bg-gradient-to-t from-pink500 to-[#fde6e6] lg:bg-white w-full flex justify-center py-10 space-x-2 text-gray-800">
          <Link href="/">Home</Link>
          <span className="font-semibold">&gt;</span>
          <span>Collection</span>
        </div>

        <div className="px-4 lg:px-12 mt-12 lg:grid lg:grid-cols-12 gap-6 mb-20">
          {/* Sidebar Skeleton - Desktop */}
          <div className="col-span-3 hidden lg:block">
            <div className="border-t border-gray-300 pt-6 space-y-6">
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
            <div className="flex border-t py-12 border-gray-300 items-center justify-between">
              <div className="h-6 w-16 bg-gray-300 animate-pulse rounded lg:hidden"></div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-20 bg-gray-300 animate-pulse rounded hidden lg:block"></div>
                <div className="hidden lg:flex gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 bg-gray-300 animate-pulse rounded border"
                    ></div>
                  ))}
                </div>
                <div className="flex lg:hidden gap-1">
                  {Array.from({ length: 2 }).map((_, i) => (
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
            <ProductGridSkeleton gridCols={gridCols} itemCount={8} />
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-[1500px] mx-auto min-h-screen">
      {inset && (
        <div className="inset-0 flex justify-center items-center fixed z-50 bg-white/60 ">
          <div className="custom-spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      {/* Breadcrumb */}
      <div className="text-xs bg-gradient-to-t from-pink-50 to-[#fde6e6] lg:bg-white w-full flex justify-center py-10 space-x-2 text-gray-800">
        <Link href="/">Home</Link>
        <span className="font-semibold">&gt;</span>
        <span>Collection</span>
        {selectedCategories.length > 0 && (
          <>
            <span className="font-semibold">&gt;</span>
            <span>{selectedCategories.join(", ")}</span>
          </>
        )}
      </div>

      <div className="px-5 lg:px-12 mt-12 lg:grid lg:grid-cols-12 gap-8">
        {/* Sidebar - Desktop */}
        <div className="col-span-3 pb-20 hidden lg:block">
          <div className="border-t border-gray-300  pt-6">
            <h2 className="font-semibold mb-4">Filter By</h2>

            {/* {searchTerm && (
              <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-sm text-blue-800">
                  Search Results
                </h3>
                <p className="text-xs text-blue-600">
                  Showing results for: "{searchTerm}"
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("search");
                    router.push(`/collection?${params.toString()}`, {
                      scroll: false,
                    });
                  }}
                  className="text-xs text-blue-600 underline mt-1"
                >
                  Clear search
                </button>
              </div>
            )} */}

            {/* Active Filters Display */}
            {selectedCategories.length > 0 && (
              <div className="mb-6 p-3 bg-green-50 rounded-lg">
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
            )}

            {/* Categories */}
            <div className="mb-8">
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
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
                          products.filter((p) => p.tags?.includes(category))
                            .length
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
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="px-2">
                <input
                  type="range"
                  min={minAllowed}
                  max={maxAllowed}
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

            {/* Availability */}
            <div className="mb-8">
              <h3 className="font-medium mb-3">Availability</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="desktop-in-stock"
                  checked={inStockOnly}
                  // onChange={() => setInStockOnly(!inStockOnly)}
                  onChange={handleStock}
                  className="h-4 w-4 accent-black rounded border-gray-300"
                />
                <label htmlFor="desktop-in-stock" className="text-sm">
                  In Stock Only
                </label>
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

        {/* Main Content */}
        <div className="col-span-9 text-xs">
          <div className="flex border-t py-12 border-gray-300 items-center justify-between">
            {/* Mobile Filter Button */}
            <div
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-1 cursor-pointer"
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
              >
                <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
              </svg>
              Filter
            </div>

            {/* Grid View Controls */}
            <div className="flex items-center gap-2">
              <div className="lg:block hidden">VIEW AS </div>
              <div
                className={`border border-gray-400 p-1 cursor-pointer ${gridCols === 1 ? "border-black" : ""}`}
                onClick={() => setGridCols(1)}
              >
                <TfiLayoutColumn3Alt
                  size={18}
                  className={`${gridCols === 1 ? "text-black" : "text-gray-400"} rotate-90`}
                />
              </div>
              <div
                onClick={() => setGridCols(2)}
                className={`border cursor-pointer ${
                  gridCols === 2
                    ? "border-black text-black"
                    : "border-gray-400 text-gray-400"
                } p-1`}
              >
                <TfiLayoutColumn2Alt size={18} />
              </div>
              <div
                onClick={() => setGridCols(3)}
                className={`border lg:block hidden cursor-pointer ${
                  gridCols === 3
                    ? "border-black text-black"
                    : "border-gray-400 text-gray-400"
                } p-1`}
              >
                <TfiLayoutColumn3Alt size={18} />
              </div>
              <div
                onClick={() => setGridCols(4)}
                className={`border xl:block hidden cursor-pointer ${
                  gridCols === 4
                    ? "border-black text-black"
                    : "border-gray-400 text-gray-400"
                } p-1`}
              >
                <TfiLayoutColumn4Alt size={18} />
              </div>
            </div>

            {/* Desktop Sort */}
            <div className="lg:flex hidden items-center gap-1 lg:gap-2">
              <div>SORT BY </div>
              <div>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="featured">Featured</option>
                  <option value="A-Z">Alphabetically, A-Z</option>
                  <option value="Z-A">Alphabetically, Z-A</option>
                  <option value="PriceL">Price, low to high</option>
                  <option value="PriceH">Price, high to low</option>
                  <option value="dateO">Date, old to new</option>
                  <option value="dateN">Date, new to old</option>
                </select>
              </div>
            </div>

            {/* Mobile Sort Button */}
            <div
              onClick={() => setIsSortOpen(true)}
              className="lg:hidden flex items-center gap-1 cursor-pointer"
            >
              Sort
              <IoChevronDownOutline />
            </div>
          </div>

          {/* Products Grid */}
          <div className="py-4">
            {products.length === 0 ? (
              <div className="flex flex-col items-center gap-5 py-14">
                {/* <div className="text-xs text-gray-500">
                  Showing 0 of {products.length} products
                </div> */}
                <div className="font-semibold text-sm space-y-2 text-center">
                  <div>NO PRODUCT FOUND</div>
                  {selectedCategories.length > 0 ? (
                    <div>
                      NO PRODUCTS IN {selectedCategories.join(", ")} -{" "}
                      <span
                        onClick={clearFilters}
                        className="underline cursor-pointer underline-offset-2"
                      >
                        CLEAR FILTERS
                      </span>
                    </div>
                  ) : (
                    <div>
                      USE FEWER FILTERS OR{" "}
                      <span
                        onClick={clearFilters}
                        className="underline cursor-pointer underline-offset-2"
                      >
                        CLEAR ALL
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* <div className="text-xs text-gray-500 mb-4">
                  Showing {sortedProducts.length} of {products.length} products */}
                {/* {searchTerm && ` for "${searchTerm}"`} */}
                {/* {selectedCategories.length > 0 &&
                    ` in ${selectedCategories.join(", ")}`}
                </div> */}
                {/* Simple card design */}
                {gridCols == 1 ? (
                  <InfiniteScroll
                    dataLength={products.length}
                    next={loadMore}
                    hasMore={hasMore}
                    loader={
                      products.length > 0 && totalCount !== null ? (
                        <InfiniteScrollingtLoading
                          progress={progress}
                          loadedCount={products.length}
                          totalCount={totalCount}
                        />
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          Loading products...
                        </div>
                      )
                    }
                    endMessage={
                      <NoMoreProduct
                        progress={progress}
                        loadedCount={products.length}
                        totalCount={totalCount ?? 0}
                      />
                    }
                  >
                    <div className=" w-full mb-16">
                      {products.map((product: Product) => (
                        <div
                          key={product._id}
                          className="space-y-5 border-b mb-10 border-gray-300"
                        >
                          <div className="text-xs flex sm:flex-row flex-col gap-2 sm:gap-5   md:gap-10 relative space-y-3  pb-6">
                            <Link href={`/collection/${product._id}`}>
                              <div className="h-96 w-full sm:w-sm shrink-0 grow bg-gray-100">
                                {product.imageUrl ? (
                                  <Image
                                    src={urlFor(product.imageUrl).url() || ""}
                                    alt={product.title}
                                    className="img-slider-img "
                                    width={280}
                                    height={280}
                                  />
                                ) : (
                                  <div className="w-full flex justify-center items-center h-full bg-gray-200">
                                    <p className="text-gray-500 ">
                                      No image available
                                    </p>
                                  </div>
                                )}
                              </div>
                            </Link>
                            <div className="space-y-2">
                              <div className="hover:underline underline-offset-4 font-medium">
                                {getProductCategory(product) && (
                                  <span className="text-gray-500 text-xs block">
                                    {getProductCategory(product)}
                                  </span>
                                )}
                                {product.title}
                              </div>
                              <div className="md:block hidden">
                                {product.description}
                              </div>
                              <div className="flex flex-row gap-3 items-center">
                                {product.originalPrice ? (
                                  <span className="text-[#D12442] font-bold text-sm">
                                    Rs.{product.price}
                                  </span>
                                ) : (
                                  <span className="font-bold text-sm">
                                    Rs.{product.price}
                                  </span>
                                )}
                                {product.originalPrice && (
                                  <div className="font-semibold text-sm line-through">
                                    Rs.{product.originalPrice}
                                  </div>
                                )}
                              </div>
                              {product.isNew && (
                                <div className="absolute top-1 sm:top-3 left-0 font-medium  text-[9px] sm:text-xs text-white bg-[#ffbb49]  sm:py-1 sm:px-2 px-1 py-0.5">
                                  New In
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </InfiniteScroll>
                ) : (
                  <InfiniteScroll
                    dataLength={products.length}
                    next={loadMore}
                    hasMore={hasMore}
                    loader={
                      products.length > 0 && totalCount !== null ? (
                        <InfiniteScrollingtLoading
                          progress={progress}
                          loadedCount={products.length}
                          totalCount={totalCount}
                        />
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          Loading products...
                        </div>
                      )
                    }
                    endMessage={
                      <NoMoreProduct
                        progress={progress}
                        loadedCount={products.length}
                        totalCount={totalCount ?? 0}
                      />
                    }
                  >
                    <div
                      className={`grid ${getGridClass()} gap-5 pb-16 sm:gap-8`}
                    >
                      {products.map((product: Product, index: number) => (
                        <div
                          key={index}
                          className="text-xs text-center relative space-y-3"
                        >
                          {product._id ? (
                            <Link href={`/collection/${product._id}`}>
                              {/* Product Image */}
                              {product.imageUrl ? (
                                <div
                                  className={`w-full h-80   xs:h-56 sm:h-80 
                                ${gridCols == 2 ? "md:h-[450px]" : ""} bg-gray-100`}
                                >
                                  <Image
                                    src={
                                      urlFor(product.imageUrl).url() ||
                                      "/im3.jpg"
                                    }
                                    alt={product.title}
                                    width={500}
                                    height={500}
                                    // className="w-full max-h-full mx-auto my-auto object-cover"
                                    className="img-slider-img"
                                    onError={(e) => {
                                      console.error(
                                        "Image failed to load for product:",
                                        product.title
                                      );
                                      e.currentTarget.src =
                                        "https://images.unsplash.com/photo-1602524204986-6cfd29f63c41";
                                    }}
                                  />
                                </div>
                              ) : (
                                <div
                                  className={`w-full h-80   xs:h-56 sm:h-80 
                                  ${gridCols == 2 ? "md:h-[450px]" : ""}  flex items-center justify-center bg-gray-200`}
                                >
                                  <p className="text-gray-500 ">
                                    No image available
                                  </p>
                                </div>
                              )}

                              {/* Product Title with Category from Tags */}
                              <div className="hover:underline mt-2 underline-offset-4 text-gray-700 font-medium">
                                {getProductCategory(product) && (
                                  <span className="text-gray-500 text-xs block">
                                    {getProductCategory(product)}
                                  </span>
                                )}
                                {product.title}
                              </div>

                              {/* Product Price */}
                              <div className="flex flex-col sm:flex-row sm:gap-3 items-center justify-center">
                                {product.originalPrice ? (
                                  <span className="text-[#D12442] font-bold text-sm">
                                    Rs.{product.price}
                                  </span>
                                ) : (
                                  <span className="font-bold text-sm">
                                    Rs.{product.price}
                                  </span>
                                )}
                                {product.originalPrice && (
                                  <div className="font-semibold text-sm line-through">
                                    Rs.{product.originalPrice}
                                  </div>
                                )}
                              </div>

                              {product.isNew && (
                                <div className="absolute top-1 sm:top-3 left-0 font-medium text-[9px] sm:text-xs text-white bg-[#ffbb49] sm:py-1 sm:px-2 px-1 py-0.5">
                                  New In
                                </div>
                              )}
                            </Link>
                          ) : (
                            <p className="text-red-500 text-center">
                              Product unavailable
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </InfiniteScroll>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {/* {isFilterOpen && ( */}
      <div
        className={` bg-black/80 bg-opacity-50 w-full lg:hidden  flex justify-start
          ${isFilterOpen ? "fixed inset-0 z-50 min-h-screen " : ""}`}
      >
        <div
          className={`bg-white height fixed top-0  w-[90vw] xs:w-80 h-full overflow-y-auto p-6 duration-500 overflow-x-hidden ${isFilterOpen ? "" : "-translate-x-full "} `}
          ref={modalRef}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Filter Products</h2>
            <button
              onClick={() => setIsFilterOpen(false)}
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

          {/* Search Results Info */}
          {/* {searchTerm && (
            <div className="mb-6 p-3 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-sm text-blue-800">
                Search Results
              </h3>
              <p className="text-xs text-blue-600">
                Showing results for: "{searchTerm}"
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("search");
                  router.push(`/collection?${params.toString()}`, {
                    scroll: false,
                  });
                }}
                className="text-xs text-blue-600 underline mt-1"
              >
                Clear search
              </button>
            </div>
          )} */}

          {/* Active Filters Display */}
          {selectedCategories.length > 0 && (
            <div className="mb-6 p-3 bg-green-50 rounded-lg">
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
          )}

          {/* Categories */}
          <div className="mb-8">
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {/* {["Men", "Women", "Kids", "Perfume"].map((category) => ( */}
              {tags.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`mobile-${category}`}
                    checked={selectedCategories.includes(category)}
                    onChange={() => {
                      setIsFilterOpen(false), toggleCategory(category);
                    }}
                    className="h-4 w-4 rounded border-gray-300 accent-black"
                  />
                  <label htmlFor={`mobile-${category}`} className="text-sm">
                    {category}
                    {/* <span className="text-gray-400 ml-1">
                      (
                      {
                        products.filter((p) => p.tags?.includes(category))
                          .length
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
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="px-2">
              <input
                type="range"
                min={minAllowed}
                max={maxAllowed}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([
                    priceRange[0],
                    Number.parseInt(e.target.value),
                  ])
                }
                className="w-full accent-black"
              />
              <div className="flex justify-between text-sm mt-2">
                <span>Rs.{priceRange[0].toLocaleString()}</span>
                <span>Rs.{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="mb-8">
            <h3 className="font-medium mb-3">Availability</h3>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="mobile-in-stock"
                checked={inStockOnly}
                onChange={handleStock}
                className="h-4 w-4 rounded border-gray-300 accent-black"
              />
              <label htmlFor="mobile-in-stock" className="text-sm">
                In Stock Only
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 my-6 ">
            <button
              onClick={() => {
                clearFilters(), setIsFilterOpen(false);
              }}
              className="flex-1 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sort Modal */}
      {isSortOpen && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white w-80 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Sort By</h2>
              <button
                onClick={() => setIsSortOpen(false)}
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

            <div className="space-y-3">
              {[
                { value: "featured", label: "Featured" },
                { value: "A-Z", label: "Alphabetically, A-Z" },
                { value: "Z-A", label: "Alphabetically, Z-A" },
                { value: "PriceL", label: "Price, low to high" },
                { value: "PriceH", label: "Price, high to low" },
                { value: "dateO", label: "Date, old to new" },
                { value: "dateN", label: "Date, new to old" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`sort-${option.value}`}
                    name="sort-option"
                    value={option.value}
                    checked={applySort === option.value}
                    onChange={() => {
                      setApplySort(option.value);
                      // setIsSortOpen(false);
                    }}
                    className="h-4 w-4 border-gray-300 accent-black"
                  />
                  <label htmlFor={`sort-${option.value}`} className="text-sm">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setSortOption(applySort), setIsSortOpen(false);
              }}
              className="w-full mt-6 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
