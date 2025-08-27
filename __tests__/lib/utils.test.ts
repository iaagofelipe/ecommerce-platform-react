import { formatPrice, formatDate, getStatusColor, getStatusLabel, generateUUID } from "@/lib/utils"

describe("utils", () => {
  describe("formatPrice", () => {
    it("formats price in cents to Brazilian Real", () => {
      expect(formatPrice(1000)).toBe("R$ 10,00")
      expect(formatPrice(1999)).toBe("R$ 19,99")
      expect(formatPrice(0)).toBe("R$ 0,00")
    })
  })

  describe("formatDate", () => {
    it("formats ISO date string to Brazilian format", () => {
      const isoDate = "2024-01-15T14:30:00Z"
      const formatted = formatDate(isoDate)

      // Check that it contains expected parts (exact format may vary by locale)
      expect(formatted).toMatch(/15\/01\/2024/)
      expect(formatted).toMatch(/14:30/)
    })
  })

  describe("getStatusColor", () => {
    it("returns correct color classes for each status", () => {
      expect(getStatusColor("NEW")).toContain("blue")
      expect(getStatusColor("PAY_PENDING")).toContain("yellow")
      expect(getStatusColor("PAID")).toContain("green")
      expect(getStatusColor("SHIPPED")).toContain("purple")
      expect(getStatusColor("CANCELLED")).toContain("red")
      expect(getStatusColor("UNKNOWN")).toContain("gray")
    })
  })

  describe("getStatusLabel", () => {
    it("returns correct Portuguese labels for each status", () => {
      expect(getStatusLabel("NEW")).toBe("Novo")
      expect(getStatusLabel("PAY_PENDING")).toBe("Pagamento Pendente")
      expect(getStatusLabel("PAID")).toBe("Pago")
      expect(getStatusLabel("SHIPPED")).toBe("Enviado")
      expect(getStatusLabel("CANCELLED")).toBe("Cancelado")
      expect(getStatusLabel("UNKNOWN")).toBe("UNKNOWN")
    })
  })

  describe("generateUUID", () => {
    it("generates a valid UUID format", () => {
      const uuid = generateUUID()
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

      expect(uuid).toMatch(uuidRegex)
    })
  })
})
