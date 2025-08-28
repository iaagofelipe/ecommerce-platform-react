"use client"

import Link from "next/link"
import {ShoppingCart, Search, User, Menu, Package} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import {ThemeToggle} from "@/components/theme-toggle"
import {CartCountBadge} from "@/components/cart-count-badge"

import {useCart} from "@/hooks/use-cart"

export function Header() {
    const {getTotalItems, toggleCart} = useCart()
    const totalItems = getTotalItems()

    return (
        <header
            className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">EC</span>
                    </div>
                    <span className="font-bold text-xl">E-commerce</span>
                </Link>

                {/* Navigation - Hidden on mobile */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                        Produtos
                    </Link>
                    <Link href="/orders" className="text-sm font-medium hover:text-primary transition-colors">
                        Pedidos
                    </Link>
                    <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                        Admin
                    </Link>
                </nav>

                {/* Search Bar - Hidden on mobile */}
                <div className="hidden lg:flex flex-1 max-w-md mx-6">
                    <div className="relative w-full">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                        <Input placeholder="Buscar produtos..." className="pl-10 w-full"/>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <ThemeToggle/>

                    <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
                        <Link href="/orders">
                            <Package className="h-5 w-5"/>
                            <span className="sr-only">Meus pedidos</span>
                        </Link>
                    </Button>

                    {/* User Account */}
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/account">
                            <User className="h-5 w-5"/>
                            <span className="sr-only">Minha conta</span>
                        </Link>
                    </Button>

                    {/* Cart - Fixed badge positioning */}
                    <Button variant="ghost" size="icon" onClick={toggleCart} className="relative">
                        <ShoppingCart className="h-5 w-5"/>
                        {totalItems > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs min-w-[1.25rem]"
                            >
                                {totalItems > 99 ? "99+" : totalItems}
                            </Badge>
                        )}
                        <CartCountBadge className="ml-2" fallbackLabel="Carrinho de compras"/>
                    </Button>

                    {/* Mobile Menu */}
                    <Button variant="ghost" size="icon" className="md:hidden ml-2">
                        <Menu className="h-5 w-5"/>
                        <span className="sr-only">Menu</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}
