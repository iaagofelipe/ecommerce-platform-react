import { render, screen, fireEvent } from "@testing-library/react"
import { ProductCard } from "@/components/product-card"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/lib/mock-data"
import jest from "jest" // Import jest to declare the variable

// Mock the cart hook
jest.mock("@/hooks/use-cart")
const mockUseCart = useCart as jest.MockedFunction<typeof useCart>

// Mock toast
jest.mock("@/hooks/use-toast", () => ({
  toast: jest.fn(),
}))

const mockProduct: Product = {
  id: "1",
  sku: "TEST-001",
  name: "Test Product",
  description: "A test product description",
  priceCents: 1999,
  image: "/test-image.jpg",
  category: "Electronics",
  inStock: true,
}

const mockAddItem = jest.fn()

describe("ProductCard", () => {
  beforeEach(() => {
    mockUseCart.mockReturnValue({
      items: [],
      isOpen: false,
      addItem: mockAddItem,
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getTotalItems: jest.fn(() => 0),
      getTotalPrice: jest.fn(() => 0),
      openCart: jest.fn(),
      closeCart: jest.fn(),
      toggleCart: jest.fn(),
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders product information correctly", () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText("Test Product")).toBeInTheDocument()
    expect(screen.getByText("A test product description")).toBeInTheDocument()
    expect(screen.getByText("R$ 19,99")).toBeInTheDocument()
    expect(screen.getByText("Electronics")).toBeInTheDocument()
  })

  it("shows add to cart button when product is in stock", () => {
    render(<ProductCard product={mockProduct} />)

    const addButton = screen.getByRole("button", { name: /adicionar ao carrinho/i })
    expect(addButton).toBeInTheDocument()
    expect(addButton).not.toBeDisabled()
  })

  it("shows unavailable button when product is out of stock", () => {
    const outOfStockProduct = { ...mockProduct, inStock: false }
    render(<ProductCard product={outOfStockProduct} />)

    const button = screen.getByRole("button", { name: /indisponível/i })
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
  })

  it("calls addItem when add to cart button is clicked", () => {
    render(<ProductCard product={mockProduct} />)

    const addButton = screen.getByRole("button", { name: /adicionar ao carrinho/i })
    fireEvent.click(addButton)

    expect(mockAddItem).toHaveBeenCalledWith(mockProduct)
  })

  it("shows out of stock overlay when product is unavailable", () => {
    const outOfStockProduct = { ...mockProduct, inStock: false }
    render(<ProductCard product={outOfStockProduct} />)

    expect(screen.getByText("Fora de estoque")).toBeInTheDocument()
  })

  it("has proper accessibility attributes", () => {
    render(<ProductCard product={mockProduct} />)

    const image = screen.getByRole("img")
    expect(image).toHaveAttribute("alt", "Test Product")

    const favoriteButton = screen.getByLabelText("Adicionar aos favoritos")
    expect(favoriteButton).toBeInTheDocument()
  })
})
