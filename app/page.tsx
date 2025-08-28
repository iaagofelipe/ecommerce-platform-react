"use client"

import {useState} from "react"
import {Header} from "@/components/header"
import {ProductCard} from "@/components/product-card"
import {CartDrawer} from "@/components/cart-drawer"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Search, Filter} from "lucide-react"
import {useProducts} from "@/hooks/use-products"
import {Skeleton} from "@/components/ui/skeleton"
import { Product } from "@/lib/mock-data"

function adaptToCardProduct(p: {
    id: string
    sku: string
    name: string
    description: string
    priceCents: number
    imageUrl: string
    stockQty: number
    active: boolean
}) {
    return {
        id: p.id,
        sku: p.sku,
        name: p.name,
        description: p.description,
        priceCents: p.priceCents,
        image: p.imageUrl,
        category: "Geral",
        inStock: p.active && p.stockQty > 0,
    }
}

export default function HomePage() {
    const [q, setQ] = useState<string>("")
    const [status, setStatus] = useState<"active" | "inactive" | "all">("active")
    const [page, setPage] = useState(0)
    const size = 12

    const active =
        status === "all" ? undefined : status === "active"

    const {data, isLoading, isError, isFetching, refetch} = useProducts({
        q: q || undefined,
        active,
        page,
        size,
    })

    const products = (data?.content ?? []).map(adaptToCardProduct);
    const total = data?.page.totalElements ?? 0;
    const totalPages = data?.page.totalPages ?? 0;

    // categorias: vazio por enquanto (backend ainda não possui categoria)
    const categories: string[] = []

    return (
        <div className="min-h-screen bg-background">
            <Header/>
            <CartDrawer/>

            <main className="container px-4">
                {/* Hero Section */}
                <section className="text-center py-16 space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold text-balance">Encontre os melhores produtos</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                        Descubra nossa seleção cuidadosa de produtos de qualidade com entrega rápida e segura
                    </p>
                    {categories.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 pt-4">
                            {categories.map((category) => (
                                <Badge
                                    key={category}
                                    variant="outline"
                                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                                >
                                    {category}
                                </Badge>
                            ))}
                        </div>
                    )}
                </section>

                {/* Filters - Mobile */}
                <section className="md:hidden mb-8 space-y-4">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                        <Input
                            placeholder="Buscar produtos..."
                            className="pl-10"
                            value={q}
                            onChange={(e) => {
                                setPage(0)
                                setQ(e.target.value)
                            }}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Select
                            value={status}
                            onValueChange={(v: "active" | "inactive" | "all") => {
                                setPage(0)
                                setStatus(v)
                            }}
                        >
                            <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Status"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Ativos</SelectItem>
                                <SelectItem value="inactive">Inativos</SelectItem>
                                <SelectItem value="all">Todos</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                            <Filter className="h-4 w-4"/>
                        </Button>
                    </div>
                </section>

                {/* Products Grid */}
                <section className="pb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-semibold">Produtos em Destaque</h2>
                        <p className="text-sm text-muted-foreground">
                            {isLoading ? "Carregando…" : `${total} produtos encontrados`}
                        </p>
                    </div>

                    {isError && (
                        <div className="text-red-500 mb-6">
                            Ocorreu um erro ao carregar os produtos. Tente novamente.
                        </div>
                    )}

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({length: size}).map((_, i) => (
                                <div key={i} className="space-y-3">
                                    <Skeleton className="w-full h-40"/>
                                    <Skeleton className="w-3/4 h-4"/>
                                    <Skeleton className="w-1/2 h-4"/>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product: Product) => (
                                <ProductCard key={product.id} product={product}/>
                            ))}
                        </div>
                    )}

                    {/* Paginação simples */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-10">
                            <Button
                                variant="outline"
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={page === 0 || isFetching}
                            >
                                Anterior
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Página {page + 1} de {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1 || isFetching}
                            >
                                Próxima
                            </Button>
                        </div>
                    )}
                </section>
            </main>

            {/* Footer (inalterado) */}
            <footer className="border-t bg-muted/50">
                <div className="container px-4 py-12">
                    {/* ... seu conteúdo atual ... */}
                    <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                        © 2024 E-commerce Platform. Todos os direitos reservados.
                    </div>
                </div>
            </footer>
        </div>
    )
}