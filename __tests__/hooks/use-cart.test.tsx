import { renderHook, act } from "@testing-library/react"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/lib/mock-data"

// Mock product for testing
const mockProduct: Product = {
  id: "1",
  sku: "TEST-001",
  name: "Test Product",
  description: "A test product",
  priceCents: 1000,
  image: "/test-image.jpg",
  category: "Test",
  inStock: true,
}

describe("useCart", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it("should initialize with empty cart", () => {
    const { result } = renderHook(() => useCart())

    expect(result.current.items).toEqual([])
    expect(result.current.getTotalItems()).toBe(0)
    expect(result.current.getTotalPrice()).toBe(0)
    expect(result.current.isOpen).toBe(false)
  })

  it("should add item to cart", () => {
    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.addItem(mockProduct, 2)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].product).toEqual(mockProduct)
    expect(result.current.items[0].quantity).toBe(2)
    expect(result.current.getTotalItems()).toBe(2)
    expect(result.current.getTotalPrice()).toBe(2000)
  })

  it("should update quantity when adding existing item", () => {
    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.addItem(mockProduct, 1)
    })

    act(() => {
      result.current.addItem(mockProduct, 2)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(3)
    expect(result.current.getTotalItems()).toBe(3)
  })

  it("should remove item from cart", () => {
    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.addItem(mockProduct, 2)
    })

    act(() => {
      result.current.removeItem(mockProduct.id)
    })

    expect(result.current.items).toHaveLength(0)
    expect(result.current.getTotalItems()).toBe(0)
    expect(result.current.getTotalPrice()).toBe(0)
  })

  it("should update item quantity", () => {
    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.addItem(mockProduct, 2)
    })

    act(() => {
      result.current.updateQuantity(mockProduct.id, 5)
    })

    expect(result.current.items[0].quantity).toBe(5)
    expect(result.current.getTotalItems()).toBe(5)
  })

  it("should remove item when quantity is set to 0", () => {
    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.addItem(mockProduct, 2)
    })

    act(() => {
      result.current.updateQuantity(mockProduct.id, 0)
    })

    expect(result.current.items).toHaveLength(0)
  })

  it("should clear cart", () => {
    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.addItem(mockProduct, 2)
    })

    act(() => {
      result.current.clearCart()
    })

    expect(result.current.items).toHaveLength(0)
    expect(result.current.getTotalItems()).toBe(0)
  })

  it("should toggle cart open state", () => {
    const { result } = renderHook(() => useCart())

    expect(result.current.isOpen).toBe(false)

    act(() => {
      result.current.openCart()
    })

    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.closeCart()
    })

    expect(result.current.isOpen).toBe(false)

    act(() => {
      result.current.toggleCart()
    })

    expect(result.current.isOpen).toBe(true)
  })
})
