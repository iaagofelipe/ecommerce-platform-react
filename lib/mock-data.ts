export interface Product {
  id: string
  sku: string
  name: string
  description: string
  priceCents: number
  image: string
  category: string
  inStock: boolean
}

export const mockProducts: Product[] = [
  {
    id: "1",
    sku: "TECH-001",
    name: "Smartphone Galaxy Pro",
    description: "Smartphone premium com câmera de 108MP e 256GB de armazenamento",
    priceCents: 189900,
    image: "/modern-smartphone.png",
    category: "Eletrônicos",
    inStock: true,
  },
  {
    id: "2",
    sku: "TECH-002",
    name: "Notebook UltraBook",
    description: "Notebook ultrafino com processador Intel i7 e 16GB RAM",
    priceCents: 349900,
    image: "/sleek-laptop-computer.png",
    category: "Eletrônicos",
    inStock: true,
  },
  {
    id: "3",
    sku: "FASH-001",
    name: "Tênis Esportivo Premium",
    description: "Tênis para corrida com tecnologia de amortecimento avançada",
    priceCents: 29900,
    image: "/premium-running-shoes.png",
    category: "Moda",
    inStock: true,
  },
  {
    id: "4",
    sku: "HOME-001",
    name: "Cafeteira Automática",
    description: "Cafeteira com moedor integrado e controle de temperatura",
    priceCents: 79900,
    image: "/automatic-coffee-machine.png",
    category: "Casa",
    inStock: false,
  },
  {
    id: "5",
    sku: "TECH-003",
    name: "Fones Bluetooth Pro",
    description: "Fones de ouvido com cancelamento de ruído ativo",
    priceCents: 59900,
    image: "/wireless-bluetooth-headphones.png",
    category: "Eletrônicos",
    inStock: true,
  },
  {
    id: "6",
    sku: "FASH-002",
    name: "Relógio Smartwatch",
    description: "Smartwatch com monitoramento de saúde e GPS integrado",
    priceCents: 149900,
    image: "/modern-smartwatch.png",
    category: "Moda",
    inStock: true,
  },
]
