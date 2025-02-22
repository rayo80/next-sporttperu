"use client"

import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react"

import type { Currency, Product, ProductVariant, VariantPrice } from "@/types/product"
import { CartItem, CartState } from "@/types/cart";
import { useShop } from "./shop.context";


type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; variant: ProductVariant }  }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { variantId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState }
  | { type: "UPDATE_TOTAL" }

const initialState: CartState = {
  items: [],
  total: 0,
}

function calculateTotal(items: CartItem[], selectedCurrency: Currency | null): number {
  return items.reduce((total, item) => {
    const priceObject = item.variant.prices.find((p: VariantPrice) => p.currency.code === selectedCurrency?.code)
    const price = Number.parseFloat(priceObject?.price || "0")

    return total + price * item.quantity
  }, 0)
}

function cartReducer(state: CartState, action: CartAction): CartState {
  let newState: CartState
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, variant } = action.payload
      console.log("existing", variant, state.items)
      const existingItem = state.items.find((item) => item.variant.id === variant.id)
      console.log("existing2 ", existingItem)
      let newItems
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.variant.id === variant.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        newItems = [...state.items, { product, variant, quantity: 1 }]
      }

      newState = {
        items: newItems,
        total: 0,
      }
      break
    }

    case "REMOVE_ITEM": {
  
      const newItems = state.items.filter((item) => item.variant.id !== action.payload)
      newState = {
        items: newItems,
        total: 0,
      }
      break
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items.map((item) =>
        item.product.slug === action.payload.variantId ? { ...item, quantity: action.payload.quantity } : item,
      )
      newState = {
        items: newItems,
        total: 0,
      }
      break
    }

    case "CLEAR_CART":
      newState = initialState
      break

    case "UPDATE_TOTAL":
      return {
        ...state,
        total: state.total, // The actual calculation will be done in the effect
      }

    case "LOAD_CART":
      newState = action.payload
      break

    default:
      return state
  }

  localStorage.setItem('cart', JSON.stringify(newState))
  return newState
}

interface CartContextType extends CartState {
  addItem: (product: Product, variant: ProductVariant) => void
  removeItem: (varianId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { selectedCurrency } = useShop()
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) })
    }
  }, [])

  useEffect(() => {
    const total = state.items.reduce((sum, item) => {
      const price = item.variant.prices.find((p) => p.currency.code === selectedCurrency?.code)?.price || 0
      return sum + price * item.quantity
    }, 0)

    dispatch({ type: "UPDATE_TOTAL" })
  }, [state.items, selectedCurrency])

  const addItem = (product: Product, variant: ProductVariant) =>{
    console.log("Añadir variante a item", variant)
    dispatch({ type: "ADD_ITEM", payload: {product, variant} })
  }

  const removeItem = (variantId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: variantId })
  }

  const updateQuantity = (variantId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { variantId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}