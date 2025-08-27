"use client"

import Image from "next/image"
import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import { toast } from "@/hooks/use-toast"
import type { Product } from "@/lib/mock-data"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast({
        title: "Produto indisponível",
        description: "Este produto está fora de estoque.",
        variant: "destructive",
      })
      return
    }

    addItem(product)
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho.`,
    })
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="text-white bg-black/70">
                Fora de estoque
              </Badge>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Adicionar aos favoritos</span>
          </Button>
        </div>
      </CardContent>

      <CardFooter className="p-4 flex flex-col gap-3">
        <div className="space-y-2 flex-1 w-full">
          <Badge variant="outline" className="text-xs w-fit">
            {product.category}
          </Badge>
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">{product.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{product.description}</p>
          <p className="font-bold text-lg text-primary">{formatPrice(product.priceCents)}</p>
        </div>

        <Button onClick={handleAddToCart} disabled={!product.inStock} className="w-full" size="sm">
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? "Adicionar ao Carrinho" : "Indisponível"}
        </Button>
      </CardFooter>
    </Card>
  )
}
