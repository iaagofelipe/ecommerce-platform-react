"use client"

import { useState } from "react"
import {
  BarChart3,
  TrendingUp,
  Package,
  AlertTriangle,
  Settings,
  RefreshCw,
  Server,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

import { formatPrice, formatDate } from "@/lib/utils"
import { useHealth } from "@/hooks/use-orders"
import { toast } from "@/hooks/use-toast"

// Mock data for admin metrics
const mockMetrics = {
  ordersToday: 47,
  ordersYesterday: 32,
  paidPercentage: 78,
  inTransit: 23,
  totalRevenue: 1847300, // in cents
  avgOrderValue: 39300, // in cents
}

// Mock DLQ messages
const mockDLQMessages = [
  {
    id: "msg-001",
    messageId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    groupId: "order-processing",
    sentAt: "2024-01-15T14:30:00Z",
    retryCount: 3,
    errorMessage: "Connection timeout to payment service",
    payload: { orderId: "ord-123", action: "process_payment" },
  },
  {
    id: "msg-002",
    messageId: "b2c3d4e5-f6g7-8901-bcde-f23456789012",
    groupId: "inventory-update",
    sentAt: "2024-01-15T13:45:00Z",
    retryCount: 2,
    errorMessage: "Invalid SKU format",
    payload: { sku: "INVALID-SKU", quantity: 5 },
  },
  {
    id: "msg-003",
    messageId: "c3d4e5f6-g7h8-9012-cdef-345678901234",
    groupId: "order-processing",
    sentAt: "2024-01-15T12:15:00Z",
    retryCount: 1,
    errorMessage: "Customer not found",
    payload: { customerId: "invalid-uuid", orderId: "ord-456" },
  },
]

export default function AdminPage() {
  const [isReprocessing, setIsReprocessing] = useState(false)
  const { data: healthData, isLoading: healthLoading } = useHealth()

  const handleReprocessDLQ = async () => {
    setIsReprocessing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "DLQ Reprocessamento Iniciado",
      description: "As mensagens da DLQ estão sendo reprocessadas.",
    })

    setIsReprocessing(false)
  }

  const handleReprocessMessage = async (messageId: string) => {
    toast({
      title: "Mensagem Reprocessada",
      description: `Mensagem ${messageId.slice(0, 8)}... foi enviada para reprocessamento.`,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
          <p className="text-muted-foreground">Monitore métricas, gerencie DLQ e configure o sistema</p>
        </div>

        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
            <TabsTrigger value="dlq">DLQ Management</TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
          </TabsList>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockMetrics.ordersToday}</div>
                  <p className="text-xs text-muted-foreground">
                    +
                    {(
                      ((mockMetrics.ordersToday - mockMetrics.ordersYesterday) / mockMetrics.ordersYesterday) *
                      100
                    ).toFixed(1)}
                    % desde ontem
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Pagamento</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockMetrics.paidPercentage}%</div>
                  <Progress value={mockMetrics.paidPercentage} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Em Trânsito</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockMetrics.inTransit}</div>
                  <p className="text-xs text-muted-foreground">Pedidos sendo enviados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Hoje</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(mockMetrics.totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">
                    Ticket médio: {formatPrice(mockMetrics.avgOrderValue)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Distribuição de Status dos Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center space-y-2">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto">
                      <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-xs text-muted-foreground">Novos</p>
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mx-auto">
                      <CreditCard className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">8</p>
                      <p className="text-xs text-muted-foreground">Pag. Pendente</p>
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">19</p>
                      <p className="text-xs text-muted-foreground">Pagos</p>
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto">
                      <Truck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">6</p>
                      <p className="text-xs text-muted-foreground">Enviados</p>
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mx-auto">
                      <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">2</p>
                      <p className="text-xs text-muted-foreground">Cancelados</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DLQ Tab */}
          <TabsContent value="dlq" className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Dead Letter Queue (DLQ):</strong> Mensagens que falharam no processamento após múltiplas
                tentativas. Revise os erros e reprocesse quando necessário.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Mensagens na DLQ
                    <Badge variant="destructive">{mockDLQMessages.length}</Badge>
                  </CardTitle>
                  <Button onClick={handleReprocessDLQ} disabled={isReprocessing} variant="outline">
                    <RefreshCw className={`h-4 w-4 mr-2 ${isReprocessing ? "animate-spin" : ""}`} />
                    {isReprocessing ? "Reprocessando..." : "Reprocessar Todas"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {mockDLQMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">DLQ Limpa</h3>
                    <p className="text-muted-foreground">Não há mensagens com falha no momento.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Message ID</TableHead>
                        <TableHead>Grupo</TableHead>
                        <TableHead>Erro</TableHead>
                        <TableHead>Tentativas</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockDLQMessages.map((message) => (
                        <TableRow key={message.id}>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {message.messageId.slice(0, 8)}...
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{message.groupId}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-sm truncate" title={message.errorMessage}>
                              {message.errorMessage}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="destructive">{message.retryCount}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{formatDate(message.sentAt)}</TableCell>
                          <TableCell className="text-center">
                            <Button variant="ghost" size="sm" onClick={() => handleReprocessMessage(message.messageId)}>
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Reprocessar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Config Tab */}
          <TabsContent value="config" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Status do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backend API</span>
                    {healthLoading ? (
                      <Badge variant="outline">Verificando...</Badge>
                    ) : healthData?.status === "UP" ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Online
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Offline</Badge>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Endpoint Base:</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"}
                      </code>
                    </div>
                    <div className="flex justify-between">
                      <span>Ambiente:</span>
                      <Badge variant="outline">{process.env.NODE_ENV || "development"}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Última Verificação:</span>
                      <span className="text-muted-foreground">{new Date().toLocaleTimeString("pt-BR")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configurações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Polling de Status</span>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">5s</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cache TTL</span>
                      <Badge variant="outline">60s</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Retry Attempts</span>
                      <Badge variant="outline">3</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Health Check</span>
                      <Badge variant="outline">30s</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Funcionalidades</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Real-time Updates</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          Ativo
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>SSE Support</span>
                        <Badge variant="outline">Em Breve</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>DLQ Management</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          Ativo
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-medium">Frontend</h4>
                    <div className="space-y-1 text-muted-foreground">
                      <p>Next.js 14 (App Router)</p>
                      <p>React Query (TanStack)</p>
                      <p>Tailwind CSS v4</p>
                      <p>shadcn/ui</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Backend</h4>
                    <div className="space-y-1 text-muted-foreground">
                      <p>Spring Boot 3</p>
                      <p>H2 Database</p>
                      <p>SQS FIFO</p>
                      <p>Transactional Outbox</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Infraestrutura</h4>
                    <div className="space-y-1 text-muted-foreground">
                      <p>LocalStack (Dev)</p>
                      <p>Docker Compose</p>
                      <p>REST APIs</p>
                      <p>Event-Driven Architecture</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
