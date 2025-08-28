"use client"

import {X, Plus, Minus, ShoppingBag} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"
import {ScrollArea} from "@/components/ui/scroll-area"
import {formatPrice} from "@/lib/utils"
import {useCart} from "@/hooks/use-cart"

export function CartDrawer() {
    const {items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart} = useCart()

    const totalPrice = getTotalPrice()
    const totalItems = getTotalItems()

    if (items.length === 0) {
        return (
            <Sheet open={isOpen} onOpenChange={closeCart}>
                <SheetContent className="w-full sm:max-w-lg">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5"/>
                            Carrinho de Compras
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                        <ShoppingBag className="h-16 w-16 text-muted-foreground"/>
                        <div className="text-center space-y-2">
                            <h3 className="font-semibold">Seu carrinho está vazio</h3>
                            <p className="text-sm text-muted-foreground">Adicione alguns produtos para começar suas
                                compras</p>
                        </div>
                        <Button onClick={closeCart}>Continuar Comprando</Button>
                    </div>
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <Sheet open={isOpen} onOpenChange={closeCart}>
            <SheetContent className="w-full sm:max-w-lg flex flex-col">
                <SheetHeader>
                    <SheetTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5"/>
                            Carrinho de Compras
                            <Badge variant="secondary">{totalItems}</Badge>
                        </div>
                        <Button variant="ghost" size="sm" onClick={clearCart}>
                            Limpar
                        </Button>
                    </SheetTitle>
                </SheetHeader>

                <ScrollArea className="flex-1">
                    <div className="space-y-4 px-1">
                        {items.map((item) => (
                            <div key={item.product.id} className="flex gap-4 p-3 rounded-lg border bg-card">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.product.image || "/placeholder.svg"}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex-1 space-y-2">
                                    <h4 className="font-medium text-sm leading-tight">{item.product.name}</h4>
                                    <p className="text-sm font-semibold text-primary">{formatPrice(item.product.priceCents)}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 bg-transparent"
                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                            >
                                                <Minus className="h-3 w-3"/>
                                            </Button>
                                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 bg-transparent"
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                            >
                                                <Plus className="h-3 w-3"/>
                                            </Button>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                            onClick={() => removeItem(item.product.id)}
                                        >
                                            <X className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm mr-2 ml-2">
                            <span>Subtotal</span>
                            <span>{formatPrice(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between text-sm mr-2 ml-2">
                            <span>Frete</span>
                            <span className="text-green-600">Grátis</span>
                        </div>
                        <Separator/>
                        <div className="flex justify-between font-semibold mr-2 ml-2">
                            <span>Total</span>
                            <span>{formatPrice(totalPrice)}</span>
                        </div>
                    </div>

                    <Button className="w-full" size="lg" asChild onClick={closeCart}>
                        <Link href="/checkout">Finalizar Compra</Link>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
