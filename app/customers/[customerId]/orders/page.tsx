"use client"

import { useParams } from "next/navigation"
import { ArrowLeft, Package, Eye, XCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

import { formatPrice, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils"
import { useOrdersByCustomer, useCancelOrder } from "@/hooks/use-orders"

export default function CustomerOrdersPage() {
  const params = useParams()
  const customerId = params.customerId as string
  const cancelOrderMutation = useCancelOrder()

  const {
    data: ordersData,
    isLoading,
    error,
  } = useOrdersByCustomer(customerId, {
    page: 0,
    size: 50, // Show more orders on dedicated page
  })

  const handleCancelOrder = async (orderId: string) => {
    if (confirm("Tem certeza que deseja cancelar este pedido?")) {
      try {
        await cancelOrderMutation.mutateAsync(orderId)
      } catch (error) {
        console.error("Erro ao cancelar pedido:", error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-2xl py-8">
          <div className="text-center space-y-4">
            <Package className="h-16 w-16 text-muted-foreground mx-auto" />
            <h1 className="text-2xl font-bold">Erro ao carregar pedidos</h1>
            <p className="text-muted-foreground">Não foi possível carregar os pedidos deste cliente.</p>
            <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Pedidos do Cliente</h1>
            <p className="text-muted-foreground font-mono">Cliente: {customerId.slice(0, 8)}...</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Histórico de Pedidos</CardTitle>
              {ordersData && <Badge variant="outline">{ordersData.totalElements} pedidos</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            {ordersData && ordersData.content.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Nenhum pedido encontrado</h3>
                <p className="text-muted-foreground">Este cliente ainda não possui pedidos.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pedido</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Itens</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ordersData?.content.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <div className="font-mono text-sm">#{order.id.slice(0, 8)}</div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{formatDate(order.createdAt)}</div>
                          </TableCell>
                          <TableCell>{order.items.reduce((sum, item) => sum + item.qty, 0)} produtos</TableCell>
                          <TableCell className="text-right font-medium">{formatPrice(order.totalCents)}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/orders/${order.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              {(order.status === "NEW" || order.status === "PAY_PENDING") && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCancelOrder(order.id)}
                                  disabled={cancelOrderMutation.isPending}
                                >
                                  <XCircle className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {ordersData?.content.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-mono text-sm text-muted-foreground">#{order.id.slice(0, 8)}</p>
                            <p className="font-semibold">{formatPrice(order.totalCents)}</p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <p>{formatDate(order.createdAt)}</p>
                          <p>{order.items.reduce((sum, item) => sum + item.qty, 0)} produtos</p>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                            <Link href={`/orders/${order.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalhes
                            </Link>
                          </Button>
                          {(order.status === "NEW" || order.status === "PAY_PENDING") && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelOrder(order.id)}
                              disabled={cancelOrderMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
