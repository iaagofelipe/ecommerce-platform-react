"use client"

import type React from "react"
import {useState} from "react"
import {useRouter} from "next/navigation"
import {Calendar, Eye, Filter, Package, Search, XCircle} from "lucide-react"
import Link from "next/link"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Badge} from "@/components/ui/badge"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Skeleton} from "@/components/ui/skeleton"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Calendar as CalendarComponent} from "@/components/ui/calendar"

import {formatDate, formatPrice, generateUUID, getStatusColor, getStatusLabel} from "@/lib/utils"
import {useCancelOrder, useOrdersByCustomer} from "@/hooks/use-orders"

export default function OrdersPage() {
    const router = useRouter()
    const [customerId, setCustomerId] = useState("")
    const [submittedCustomerId, setSubmittedCustomerId] = useState("")
    const [filters, setFilters] = useState({
        status: "ALL", // mantido para UI; seu hook pode adaptar para o backend
        from: "",
        to: "",
        page: 0,
        size: 10,
    })
    const [showFilters, setShowFilters] = useState(false)
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})

    const cancelOrderMutation = useCancelOrder()

    const {data: ordersData, isLoading, error} = useOrdersByCustomer(
        submittedCustomerId,
        submittedCustomerId ? filters : undefined
    )

    const orders = ordersData?.content ?? []
    const totalElements = ordersData?.totalElements ?? 0
    const totalPages = ordersData?.totalPages ?? 0
    const pageNumber = ordersData?.number ?? 0

    console.log("[OrdersPage] rendered orders:", orders.length)


    const handleCustomerIdSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (customerId.trim()) {
            setSubmittedCustomerId(customerId.trim())
            setFilters((prev) => ({...prev, page: 0}))
        }
    }

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({...prev, [key]: value, page: 0}))
    }

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({...prev, page: newPage}))
    }

    const handleCancelOrder = async (orderId: string) => {
        if (confirm("Tem certeza que deseja cancelar este pedido?")) {
            try {
                await cancelOrderMutation.mutateAsync(orderId)
            } catch (error) {
                console.error("Erro ao cancelar pedido:", error)
            }
        }
    }

    const generateSampleCustomerId = () => {
        const uuid = generateUUID()
        setCustomerId(uuid)
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Gerenciar Pedidos</h1>
                    <p className="text-muted-foreground">Consulte e gerencie pedidos por cliente</p>
                </div>

                {/* Customer ID Input */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5"/>
                            Buscar Pedidos por Cliente
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCustomerIdSubmit} className="space-y-4">
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Label htmlFor="customerId">ID do Cliente (UUID)</Label>
                                    <Input
                                        id="customerId"
                                        placeholder="Digite o UUID do cliente"
                                        value={customerId}
                                        onChange={(e) => setCustomerId(e.target.value)}
                                        className="font-mono"
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <Button type="submit" disabled={!customerId.trim()}>
                                        Buscar
                                    </Button>
                                    <Button type="button" variant="outline" onClick={generateSampleCustomerId}>
                                        Gerar UUID
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Filters */}
                {submittedCustomerId  && (
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Filter className="h-5 w-5"/>
                                    Filtros
                                </CardTitle>
                                <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
                                    {showFilters ? "Ocultar" : "Mostrar"} Filtros
                                </Button>
                            </div>
                        </CardHeader>
                        {showFilters && (
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label>Status</Label>
                                        <Select
                                            value={filters.status}
                                            onValueChange={(value) => handleFilterChange("status", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Todos os status"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">Todos</SelectItem>
                                                <SelectItem value="NEW">Novo</SelectItem>
                                                <SelectItem value="PAY_PENDING">Pagamento Pendente</SelectItem>
                                                <SelectItem value="PAID">Pago</SelectItem>
                                                <SelectItem value="SHIPPED">Enviado</SelectItem>
                                                <SelectItem value="CANCELLED">Cancelado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label>Data Inicial</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal bg-transparent"
                                                >
                                                    <Calendar className="mr-2 h-4 w-4"/>
                                                    {dateRange.from ? formatDate(dateRange.from.toISOString()) : "Selecionar data"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={dateRange.from}
                                                    onSelect={(date) => {
                                                        setDateRange((prev) => ({...prev, from: date || undefined}))
                                                        handleFilterChange("from", date?.toISOString() || "")
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div>
                                        <Label>Data Final</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal bg-transparent"
                                                >
                                                    <Calendar className="mr-2 h-4 w-4"/>
                                                    {dateRange.to ? formatDate(dateRange.to.toISOString()) : "Selecionar data"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={dateRange.to}
                                                    onSelect={(date) => {
                                                        setDateRange((prev) => ({...prev, to: date || undefined}))
                                                        handleFilterChange("to", date?.toISOString() || "")
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                )}

                {/* Results */}
                {submittedCustomerId  && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Pedidos do Cliente</CardTitle>
                                <Badge variant="outline">{totalElements} pedidos encontrados</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* loading */}
                            {isLoading && (
                                <div className="space-y-4">
                                    {Array.from({length: 3}).map((_, i) => (
                                        <Skeleton key={i} className="h-16 w-full"/>
                                    ))}
                                </div>
                            )}

                            {/* erro */}
                            {error && !isLoading && (
                                <div className="text-center py-8">
                                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4"/>
                                    <h3 className="font-semibold mb-2">Erro ao carregar pedidos</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Não foi possível carregar os pedidos deste cliente.
                                    </p>
                                    <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
                                </div>
                            )}

                            {!isLoading && !error && orders.length === 0 && (
                                <div className="text-center py-8">
                                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4"/>
                                    <h3 className="font-semibold mb-2">Nenhum pedido encontrado</h3>
                                    <p className="text-muted-foreground">
                                        Este cliente ainda não possui pedidos ou os filtros não retornaram resultados.
                                    </p>
                                </div>
                            )}

                            {/* lista */}
                            {!isLoading && !error && orders.length > 0 && (
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
                                                {orders.map((order) => (
                                                    <TableRow key={order.id}>
                                                        <TableCell>
                                                            <div
                                                                className="font-mono text-sm">#{order.id.slice(0, 8)}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={getStatusColor(order.status)}>
                                                                {getStatusLabel(order.status)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm">{formatDate(order.createdAt)}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {order.items.reduce((sum, item) => sum + item.qty, 0)} produtos
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium">
                                                            {formatPrice(order.totalCents)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center justify-center gap-2">
                                                                <Button variant="ghost" size="icon" asChild>
                                                                    <Link href={`/orders/${order.id}`}>
                                                                        <Eye className="h-4 w-4"/>
                                                                    </Link>
                                                                </Button>
                                                                {(order.status === "NEW" || order.status === "PAY_PENDING") && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => handleCancelOrder(order.id)}
                                                                        disabled={cancelOrderMutation.isPending}
                                                                    >
                                                                        <XCircle className="h-4 w-4 text-destructive"/>
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
                                        {orders.map((order) => (
                                            <Card key={order.id}>
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <p className="font-mono text-sm text-muted-foreground">
                                                                #{order.id.slice(0, 8)}
                                                            </p>
                                                            <p className="font-semibold">{formatPrice(order.totalCents)}</p>
                                                        </div>
                                                        <Badge className={getStatusColor(order.status)}>
                                                            {getStatusLabel(order.status)}
                                                        </Badge>
                                                    </div>

                                                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                                                        <p>{formatDate(order.createdAt)}</p>
                                                        <p>{order.items.reduce((sum, item) => sum + item.qty, 0)} produtos</p>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm" asChild
                                                                className="flex-1 bg-transparent">
                                                            <Link href={`/orders/${order.id}`}>
                                                                <Eye className="h-4 w-4 mr-2"/>
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
                                                                <XCircle className="h-4 w-4 mr-2"/>
                                                                Cancelar
                                                            </Button>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between mt-6">
                                            <p className="text-sm text-muted-foreground">
                                                Página {pageNumber + 1} de {totalPages}
                                            </p>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handlePageChange(pageNumber - 1)}
                                                    disabled={pageNumber === 0}
                                                >
                                                    Anterior
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handlePageChange(pageNumber + 1)}
                                                    disabled={pageNumber >= totalPages - 1}
                                                >
                                                    Próxima
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
