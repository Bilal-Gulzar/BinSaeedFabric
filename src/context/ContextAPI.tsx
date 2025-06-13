"use client"
import { useParams } from "next/navigation"
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type children = {
  children: React.ReactNode
}

interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  imageUrl: string
  quantity: number
  stock:number
  size?: string
}

interface AppContextType {
  search: boolean
  setSearch: (search: boolean) => void
  cart: boolean
  setCart: (cart: boolean) => void
  menuBar: boolean
  setMenuBar: (menuBar: boolean) => void
  login: boolean
  setLogin: (login: boolean) => void
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: string, size?: string) => void
  updateQuantity: (id: string, quantity: number, size?: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  searchTerm: string
  setSearchTerm: (term: string) => void
  searchCategories: string[]
  setSearchCategories: (categories: string[]) => void
  logout:boolean
  setLogout:(logout:boolean)=>void
}

export const AppContext = createContext<AppContextType | null>(null)

// Helper functions for localStorage
const CART_STORAGE_KEY = "shopping-cart-items"

const saveCartToStorage = (items: CartItem[]) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }
  } catch (error) {
    console.error("Error saving cart to localStorage:", error)
  }
}

const loadCartFromStorage = (): CartItem[] => {
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    }
  } catch (error) {
    console.error("Error loading cart from localStorage:", error)
  }
  return []
}

export function AppWrapper({ children }: children) {
  const [search, setSearch] = useState<boolean>(false)
  const [cart, setCart] = useState<boolean>(false)
  const [menuBar, setMenuBar] = useState<boolean>(false)
  const [login, setLogin] = useState<boolean>(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [logout,setLogout] = useState(false);    
  

  // New search states
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchCategories, setSearchCategories] = useState<string[]>([])

  const param = useParams()

  // Load cart items from localStorage on component mount
  useEffect(() => {
    try{

      const storedItems = loadCartFromStorage()
      setCartItems(storedItems)
      setIsLoaded(true)
    }
    catch(e){
     console.log("error",e)
    setCartItems([])
       }
  }, [])

  // Save cart items to localStorage whenever cartItems changes
  useEffect(() => {
    if (isLoaded) {
      saveCartToStorage(cartItems)
    }
  }, [cartItems, isLoaded])

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id && cartItem.size === item.size)

      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id && cartItem.size === item.size
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        )
      } else {
        return [...prev, { ...item, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (id: string, size?: string) => {
    setCartItems((prev) => prev.filter((item) => !(item.id === id && item.size === size)))
  }

  const updateQuantity = (id: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, size)
      return
    }

    setCartItems((prev) => prev.map((item) => (item.id === id && item.size === size ? { ...item, quantity } : item)))
  }

  
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }
  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem(CART_STORAGE_KEY)
    getTotalItems()
  }

  return (
    <AppContext.Provider
      value={{
        search,
        setSearch,
        cart,
        setCart,
        menuBar,
        setMenuBar,
        login,
        setLogin,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        searchTerm,
        setSearchTerm,
        searchCategories,
        setSearchCategories,
        logout,
        setLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within AppWrapper")
  }
  return context
}

export { AppWrapper as AppProvider }
