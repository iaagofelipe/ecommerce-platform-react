"use client"

import { Badge } from "@/components/ui/badge"
import { useMounted } from "@/hooks/use-mounted"
import { useCart } from "@/hooks/use-cart"

type Props = {
    fallbackLabel?: string
    className?: string
}

export function CartCountBadge({ fallbackLabel = "Carrinho de compras", className }: Props) {
    const mounted = useMounted()
    const count = useCart((s) => s.items.length)

    return (
        <Badge className={className}>
            {mounted ? String(count) : fallbackLabel}
        </Badge>
    )
}
