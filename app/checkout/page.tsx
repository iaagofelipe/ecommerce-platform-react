"use client"

import {useState} from "react"
import {useRouter} from "next/navigation"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {ArrowLeft, User, CreditCard, Package, Dice1} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Separator} from "@/components/ui/separator"
import {Badge} from "@/components/ui/badge"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {toast} from "@/hooks/use-toast"

import {useCart} from "@/hooks/use-cart"
import {useCreateOrder} from "@/hooks/use-orders"
import {formatPrice, generateUUID} from "@/lib/utils"

const CheckoutFormSchema = z.object({
    customerId: z.string().uuid("ID do cliente deve ser um UUID válido"),
})

type CheckoutFormData = z.infer<typeof CheckoutFormSchema>

export default function CheckoutPage() {
    const router = useRouter()
    const {items, getTotalPrice, clearCart} = useCart()
    const createOrderMutation = useCreateOrder()
    const [generatedCustomerId, setGeneratedCustomerId] = useState<string>("")

    const form = useForm<CheckoutFormData>({
        resolver: zodResolver(CheckoutFormSchema),
        defaultValues: {
            customerId: "",
        },
    })

    const totalPrice = getTotalPrice()

    // Redirect if cart is empty
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container max-w-2xl py-8">
                    <div className="text-center space-y-4">
                        <Package className="h-16 w-16 text-muted-foreground mx-auto"/>
                        <h1 className="text-2xl font-bold">Carrinho Vazio</h1>
                        <p className="text-muted-foreground">
                            Você precisa adicionar produtos ao carrinho antes de finalizar a compra.
                        </p>
                        <Button asChild>
                            <Link href="/">Continuar Comprando</Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    const generateCustomerId = () => {
        const uuid = generateUUID()
        setGeneratedCustomerId(uuid)
        form.setValue("customerId", uuid)
        toast({
            title: "UUID gerado!",
            description: "Um novo ID de cliente foi gerado automaticamente.",
        })
    }

    const onSubmit = async (data: CheckoutFormData) => {
        try {
            const orderData = {
                customerId: data.customerId,
                items: items.map((item) => ({
                    sku: item.product.sku,
                    qty: item.quantity,
                    priceCents: item.product.priceCents,
                })),
            }

            const order = await createOrderMutation.mutateAsync(orderData)

            // Clear cart and redirect to order details
            clearCart()
            router.push(`/orders/${order.id}`)
        } catch (error) {
            console.error("Erro ao criar pedido:", error)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-6xl py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4"/>
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Finalizar Compra</h1>
                        <p className="text-muted-foreground">Revise seus itens e complete seu pedido</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Order Form */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5"/>
                                    Informações do Cliente
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="customerId"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>ID do Cliente (UUID)</FormLabel>
                                                    <div className="flex gap-2">
                                                        <FormControl>
                                                            <Input placeholder="Digite ou gere um UUID" {...field} />
                                                        </FormControl>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={generateCustomerId}
                                                            title="Gerar UUID"
                                                        >
                                                            <Dice1 className="h-4 w-4"/>
                                                        </Button>
                                                    </div>
                                                    <FormMessage/>
                                                    {generatedCustomerId && (
                                                        <p className="text-xs text-muted-foreground">
                                                            UUID gerado: {generatedCustomerId.slice(0, 8)}...
                                                        </p>
                                                    )}
                                                </FormItem>
                                            )}
                                        />

                                        <div className="pt-4">
                                            <Button type="submit" className="w-full" size="lg"
                                                    disabled={createOrderMutation.isPending}>
                                                {createOrderMutation.isPending ? "Processando..." : `Criar Pedido - ${formatPrice(totalPrice)}`}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>

                        {/* Payment Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5"/>
                                    Informações de Pagamento
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="p-4 bg-muted rounded-lg">
                                        <p className="text-sm text-muted-foreground">
                                            O pagamento será processado após a criação do pedido. Você poderá simular o
                                            pagamento na página de
                                            detalhes do pedido.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Resumo do Pedido</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Items */}
                                <div className="space-y-3">
                                    {items.map((item) => (
                                        <div key={item.product.id} className="flex gap-3">
                                            <div className="relative h-12 w-12 rounded-md overflow-hidden">
                                                <Image
                                                    src={item.product.image || "/placeholder.svg"}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h4 className="font-medium text-sm leading-tight">{item.product.name}</h4>
                                                <div className="flex items-center justify-between">
                                                    <Badge variant="outline" className="text-xs">
                                                        {item.product.sku}
                                                    </Badge>
                                                    <span
                                                        className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{formatPrice(item.product.priceCents * item.quantity)}</p>
                                                <p className="text-xs text-muted-foreground">{formatPrice(item.product.priceCents)} cada</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator/>

                                {/* Totals */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Frete</span>
                                        <span className="text-green-600">Grátis</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Impostos</span>
                                        <span>Inclusos</span>
                                    </div>
                                    <Separator/>
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Total</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security Info */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center space-y-2">
                                    <div
                                        className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                        <div className="h-4 w-4 rounded-full bg-green-500"/>
                                        Compra 100% Segura
                                    </div>
                                    <p className="text-xs text-muted-foreground">Seus dados estão protegidos com
                                        criptografia SSL</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
