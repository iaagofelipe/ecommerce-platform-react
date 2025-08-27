"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Package, Clock, CheckCircle, Truck, XCircle, CreditCard, RotateCcw } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { useOrder, usePayOrder, useCancelOrder } from "@/hooks/use-orders"
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils"
import { RealTimeIndicator } from "@/components/real-time-indicator"
import { OrderStatusLive } from "@/components/order-status-live"

const statusIcons = {
  NEW: Clock,
  PAY_PENDING: CreditCard,
  PAID: CheckCircle,
  SHIPPED: Truck,
  CANCELLED: XCircle,
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const { data: order, isLoading, error, dataUpdatedAt, isFetching } = useOrder(orderId, { realTime: true })
  const payOrderMutation = usePayOrder()
  const cancelOrderMutation = useCancelOrder()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-2xl py-8">
          <div className="text-center space-y-4">
            <Package className="h-16 w-16 text-muted-foreground mx-auto" />
            <h1 className="text-2xl font-bold">Pedido não encontrado</h1>
            <p className="text-muted-foreground">O pedido que você está procurando não existe ou foi removido.</p>
            <Button asChild>
              <Link href="/">Voltar ao Início</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const StatusIcon = statusIcons[order.status] || Clock
  const canPay = order.status === "NEW" || order.status === "PAY_PENDING"
  const canCancel = order.status === "NEW" || order.status === "PAY_PENDING"

  const handlePay = async () => {
    try {
      await payOrderMutation.mutateAsync(orderId)
    } catch (error) {
      console.error("Erro ao processar pagamento:", error)
    }
  }

  const handleCancel = async () => {
    if (confirm("Tem certeza que deseja cancelar este pedido?")) {
      try {
        await cancelOrderMutation.mutateAsync(orderId)
      } catch (error) {
        console.error("Erro ao cancelar pedido:", error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Pedido #{order.id.slice(0, 8)}</h1>
              <Badge className={getStatusColor(order.status)}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {getStatusLabel(order.status)}
              </Badge>
            </div>
            <p className="text-muted-foreground">Criado em {formatDate(order.createdAt)}</p>
          </div>
          <RealTimeIndicator isPolling={true} lastUpdate={new Date(dataUpdatedAt)} />
        </div>

        <OrderStatusLive status={order.status} createdAt={order.createdAt} isUpdating={isFetching} className="mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">ID do Pedido</p>
                  <p className="font-mono">{order.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cliente</p>
                  <p className="font-mono">{order.customerId.slice(0, 8)}...</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-semibold text-lg">{formatPrice(order.totalCents)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Itens</p>
                  <p>{order.items.reduce((sum, item) => sum + item.qty, 0)} produtos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {canPay && (
                <Button onClick={handlePay} disabled={payOrderMutation.isPending} className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  {payOrderMutation.isPending ? "Processando..." : "Simular Pagamento"}
                </Button>
              )}

              {canCancel && (
                <Button
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={cancelOrderMutation.isPending}
                  className="w-full"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {cancelOrderMutation.isPending ? "Cancelando..." : "Cancelar Pedido"}
                </Button>
              )}

              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href={`/customers/${order.customerId}/orders`}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Ver Todos os Pedidos
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Itens do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-center">Quantidade</TableHead>
                  <TableHead className="text-right">Preço Unitário</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <Badge variant="outline" className="text-xs mb-1">
                          {item.sku}
                        </Badge>
                        <p className="font-medium">Produto {item.sku}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{item.qty}</TableCell>
                    <TableCell className="text-right">{formatPrice(item.priceCents)}</TableCell>
                    <TableCell className="text-right font-medium">{formatPrice(item.priceCents * item.qty)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Separator className="my-4" />

            <div className="flex justify-end">
              <div className="space-y-2 text-right">
                <div className="flex justify-between gap-8 text-sm">
                  <span>Subtotal:</span>
                  <span>{formatPrice(order.totalCents)}</span>
                </div>
                <div className="flex justify-between gap-8 text-sm">
                  <span>Frete:</span>
                  <span className="text-green-600">Grátis</span>
                </div>
                <Separator />
                <div className="flex justify-between gap-8 font-semibold text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(order.totalCents)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Updates Info */}
        <Alert className="mt-6">
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Esta página é atualizada automaticamente a cada 3 segundos para mostrar mudanças de status em tempo real.
            {isFetching && " Atualizando dados..."}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
