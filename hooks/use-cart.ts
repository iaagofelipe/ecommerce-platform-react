"use client"

import {create} from "zustand"
import {persist} from "zustand/middleware"
import type {Product} from "@/lib/mock-data"

export interface CartItem {
    product: Product
    quantity: number
}

interface CartStore {
    items: CartItem[]
    isOpen: boolean
    addItem: (product: Product, quantity?: number) => void
    removeItem: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    getTotalItems: () => number
    getTotalPrice: () => number
    openCart: () => void
    closeCart: () => void
    toggleCart: () => void
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            addItem: (product, quantity = 1) => {
                set((state) => {
                    const existingItem = state.items.find((item) => item.product.id === product.id)

                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.product.id === product.id ? {...item, quantity: item.quantity + quantity} : item,
                            ),
                        }
                    }

                    return {
                        items: [...state.items, {product, quantity}],
                    }
                })
            },
            removeItem: (productId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.product.id !== productId),
                }))
            },
            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId)
                    return
                }

                set((state) => ({
                    items: state.items.map((item) => (item.product.id === productId ? {...item, quantity} : item)),
                }))
            },
            clearCart: () => {
                set({items: []})
            },
            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0)
            },
            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + item.product.priceCents * item.quantity, 0)
            },
            openCart: () => set({isOpen: true}),
            closeCart: () => set({isOpen: false}),
            toggleCart: () => set((state) => ({isOpen: !state.isOpen})),
        }),
        {
            name: "cart-storage",
            partialize: (state) => ({items: state.items}),
        },
    ),
)
