import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/hooks/use-toast"
import apiClient from "@/lib/api"
import type { Order, CreateOrderRequest, PaginatedOrders } from "@/lib/schemas"

// Query keys
export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  byCustomer: (customerId: string) => [...orderKeys.all, "customer", customerId] as const,
}

// Create order mutation
export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateOrderRequest): Promise<Order> => {
      const response = await apiClient.post("/orders", data)
      return response.data
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
      toast({
        title: "Pedido criado com sucesso!",
        description: `Pedido #${order.id.slice(0, 8)} foi criado.`,
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar pedido",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      })
    },
  })
}

export function useOrder(id: string, options?: { enabled?: boolean; realTime?: boolean }) {
  const queryClient = useQueryClient()
  const realTimeEnabled = options?.realTime !== false

  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async (): Promise<Order> => {
      const response = await apiClient.get(`/orders/${id}`)
      return response.data
    },
    enabled: options?.enabled !== false && !!id,
    refetchInterval: realTimeEnabled ? 3000 : false, // Poll every 3 seconds for real-time updates
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    onSuccess: (newOrder) => {
      // Check for status changes and show notifications
      const previousOrder = queryClient.getQueryData<Order>(orderKeys.detail(id))
      if (previousOrder && previousOrder.status !== newOrder.status) {
        toast({
          title: "Status do pedido atualizado!",
          description: `Pedido #${id.slice(0, 8)} mudou para: ${getStatusLabel(newOrder.status)}`,
        })
      }
    },
  })
}

// Get orders by customer
export function useOrdersByCustomer(
  customerId: string,
  filters?: {
    page?: number
    size?: number
    status?: string
    from?: string
    to?: string
  },
) {
  return useQuery({
    queryKey: orderKeys.list({ customerId, ...filters }),
    queryFn: async (): Promise<PaginatedOrders> => {
      const params = new URLSearchParams()
      if (filters?.page !== undefined) params.append("page", filters.page.toString())
      if (filters?.size !== undefined) params.append("size", filters.size.toString())
      if (filters?.status && filters.status !== "ALL") params.append("status", filters.status)
      if (filters?.from) params.append("from", filters.from)
      if (filters?.to) params.append("to", filters.to)

      const response = await apiClient.get(`/orders/customer/${customerId}?${params}`)
      return response.data
    },
    enabled: !!customerId,
    refetchInterval: 10000, // Refresh list every 10 seconds
  })
}

// Pay order mutation
export function usePayOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderId: string): Promise<void> => {
      await apiClient.post(`/orders/${orderId}/pay`)
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) })
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
      toast({
        title: "Pagamento processado!",
        description: "O pagamento foi processado com sucesso.",
      })
    },
    onError: (error) => {
      toast({
        title: "Erro no pagamento",
        description: error.message || "Não foi possível processar o pagamento.",
        variant: "destructive",
      })
    },
  })
}

// Cancel order mutation
export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderId: string): Promise<void> => {
      await apiClient.post(`/orders/${orderId}/cancel`)
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) })
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
      toast({
        title: "Pedido cancelado",
        description: "O pedido foi cancelado com sucesso.",
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao cancelar pedido",
        description: error.message || "Não foi possível cancelar o pedido.",
        variant: "destructive",
      })
    },
  })
}

export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const response = await apiClient.get("/actuator/health")
      return response.data
    },
    refetchInterval: 30000, // Check every 30 seconds
    retry: 1,
    meta: {
      errorMessage: "Backend connection failed",
    },
  })
}

export function useOrderSSE(orderId: string, options?: { enabled?: boolean }) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ["order-sse", orderId],
    queryFn: async () => {
      // This would connect to SSE endpoint when available
      // For now, return null as SSE is not implemented in backend
      return null
    },
    enabled: false, // Disabled until backend SSE is implemented
    refetchInterval: false,
  })
}

// Helper function for status labels
function getStatusLabel(status: string): string {
  switch (status) {
    case "NEW":
      return "Novo"
    case "PAY_PENDING":
      return "Pagamento Pendente"
    case "PAID":
      return "Pago"
    case "SHIPPED":
      return "Enviado"
    case "CANCELLED":
      return "Cancelado"
    default:
      return status
  }
}
