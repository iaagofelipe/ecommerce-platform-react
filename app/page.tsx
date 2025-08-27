"use client"

import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { CartDrawer } from "@/components/cart-drawer"
import { mockProducts } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

export default function HomePage() {
  const categories = Array.from(new Set(mockProducts.map((p) => p.category)))

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <main className="container px-4">
        {/* Hero Section */}
        <section className="text-center py-16 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-balance">Encontre os melhores produtos</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Descubra nossa seleção cuidadosa de produtos de qualidade com entrega rápida e segura
          </p>
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
        </section>

        {/* Filters - Mobile */}
        <section className="md:hidden mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Buscar produtos..." className="pl-10" />
          </div>
          <div className="flex gap-3">
            <Select>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Products Grid */}
        <section className="pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">Produtos em Destaque</h2>
            <p className="text-sm text-muted-foreground">{mockProducts.length} produtos encontrados</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Load More */}
        <section className="text-center pb-16">
          <Button variant="outline" size="lg">
            Carregar Mais Produtos
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold">E-commerce</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sua loja online de confiança com os melhores produtos e atendimento.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Atendimento</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>Central de Ajuda</li>
                <li>Fale Conosco</li>
                <li>Trocas e Devoluções</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Empresa</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>Sobre Nós</li>
                <li>Trabalhe Conosco</li>
                <li>Sustentabilidade</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>Termos de Uso</li>
                <li>Política de Privacidade</li>
                <li>Cookies</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 E-commerce Platform. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
