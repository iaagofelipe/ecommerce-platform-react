import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString))
}

export function generateUUID(): string {
  return crypto.randomUUID()
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "NEW":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "PAY_PENDING":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "PAID":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "SHIPPED":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    case "CANCELLED":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

export function getStatusLabel(status: string): string {
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
