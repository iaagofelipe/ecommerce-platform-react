import { z } from "zod"

export const OrderStatus = z.enum(["NEW", "PAY_PENDING", "PAID", "SHIPPED", "CANCELLED"])

export const OrderItemSchema = z.object({
  sku: z.string().min(1, "SKU é obrigatório"),
  qty: z.number().min(1, "Quantidade deve ser maior que 0"),
  priceCents: z.number().min(1, "Preço deve ser maior que 0"),
})

export const CreateOrderSchema = z.object({
  customerId: z.string().uuid("ID do cliente deve ser um UUID válido"),
  items: z.array(OrderItemSchema).min(1, "Pelo menos um item é obrigatório"),
})

export const OrderSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  status: OrderStatus,
  totalCents: z.number(),
  createdAt: z.string(),
  items: z.array(OrderItemSchema),
})

export const PaginatedOrdersSchema = z.object({
  content: z.array(OrderSchema),
  totalElements: z.number(),
  totalPages: z.number(),
  number: z.number(),
  size: z.number(),
})

export type OrderStatus = z.infer<typeof OrderStatus>
export type OrderItem = z.infer<typeof OrderItemSchema>
export type CreateOrderRequest = z.infer<typeof CreateOrderSchema>
export type Order = z.infer<typeof OrderSchema>
export type PaginatedOrders = z.infer<typeof PaginatedOrdersSchema>
