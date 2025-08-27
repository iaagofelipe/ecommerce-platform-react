# E-commerce Platform

Uma plataforma de e-commerce moderna e responsiva construída com Next.js 14, TypeScript e Tailwind CSS, integrada com um backend Spring Boot 3.

## 🚀 Funcionalidades

### Frontend
- **Catálogo de Produtos**: Grid responsivo com filtros e busca
- **Carrinho de Compras**: Gerenciamento de itens com persistência local
- **Checkout**: Formulário validado com Zod e react-hook-form
- **Gestão de Pedidos**: Listagem, filtros e paginação
- **Painel Admin**: Métricas, DLQ management e configurações
- **Atualizações em Tempo Real**: Polling automático e notificações
- **Tema Claro/Escuro**: Suporte completo com persistência
- **Acessibilidade**: ARIA labels, navegação por teclado, contraste adequado

### Backend Integration
- **API REST**: Integração completa com Spring Boot 3
- **SQS FIFO**: Processamento assíncrono via Transactional Outbox
- **Health Checks**: Monitoramento de status do backend
- **Error Handling**: Tratamento robusto de erros e retry logic

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (componentes)
- **TanStack Query** (gerenciamento de estado)
- **React Hook Form + Zod** (formulários e validação)
- **Zustand** (estado do carrinho)
- **Axios** (cliente HTTP)

### Backend (Separado)
- **Spring Boot 3**
- **H2 Database**
- **SQS FIFO**
- **Transactional Outbox Pattern**

### Testes
- **Jest**
- **React Testing Library**
- **Coverage Reports**

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Backend Spring Boot rodando (porta 8080)
- LocalStack (para SQS local)

### 1. Clone e instale dependências
\`\`\`bash
git clone <repository-url>
cd ecommerce-platform
npm install
\`\`\`

### 2. Configure variáveis de ambiente
\`\`\`bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
\`\`\`

### 3. Execute o projeto
\`\`\`bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build
npm start

# Testes
npm test
npm run test:coverage
\`\`\`

## 🏗️ Estrutura do Projeto

\`\`\`
├── app/                    # App Router (Next.js 14)
│   ├── admin/             # Painel administrativo
│   ├── checkout/          # Fluxo de checkout
│   ├── orders/            # Gestão de pedidos
│   └── customers/         # Pedidos por cliente
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── header.tsx        # Cabeçalho principal
│   ├── product-card.tsx  # Card de produto
│   └── cart-drawer.tsx   # Drawer do carrinho
├── hooks/                # Custom hooks
│   ├── use-cart.ts       # Gerenciamento do carrinho
│   └── use-orders.ts     # Hooks de pedidos
├── lib/                  # Utilitários
│   ├── api.ts           # Cliente HTTP
│   ├── schemas.ts       # Schemas Zod
│   ├── utils.ts         # Funções utilitárias
│   └── mock-data.ts     # Dados mock
└── __tests__/           # Testes
    ├── components/      # Testes de componentes
    ├── hooks/          # Testes de hooks
    └── lib/            # Testes de utilitários
\`\`\`

## 🔄 Fluxo de Pedidos

### 1. Criação de Pedido
1. Cliente adiciona produtos ao carrinho
2. Preenche formulário de checkout com UUID
3. Frontend chama `POST /orders`
4. Backend salva no H2 e publica evento SQS
5. Redirecionamento para página de detalhes

### 2. Processamento Assíncrono
1. Consumidor SQS processa eventos
2. Status evolui: `NEW` → `PAY_PENDING` → `PAID` → `SHIPPED`
3. Frontend polling detecta mudanças (3s)
4. Notificações em tempo real para usuário

### 3. Gestão de Pedidos
- Listagem com filtros (status, data)
- Paginação automática
- Ações: pagar, cancelar, visualizar
- Histórico completo por cliente

## 🧪 Testes

### Executar testes
\`\`\`bash
# Todos os testes
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
\`\`\`

### Cobertura
- **Hooks**: useCart, useOrders
- **Componentes**: ProductCard, OrderStatusLive
- **Utilitários**: formatPrice, getStatusLabel
- **Meta**: 70% de cobertura mínima

## 🎨 Design System

### Cores
- **Primária**: Emerald (confiança, eficiência)
- **Neutros**: Whites, grays (limpeza)
- **Acentos**: Green variants (CTAs)

### Tipografia
- **Fonte**: Geist Sans/Mono
- **Hierarquia**: Consistente com line-height otimizado

### Componentes
- **Cards**: Elevação sutil, bordas arredondadas
- **Botões**: Estados claros, feedback visual
- **Formulários**: Validação em tempo real
- **Tabelas**: Responsivas (cards em mobile)

## 🌐 Internacionalização

### Idiomas Suportados
- **Português (pt-BR)**: Padrão
- **Inglês (en-US)**: Preparado para futuro

### Formatação
- **Moeda**: Real brasileiro (R$)
- **Data**: DD/MM/AAAA HH:mm
- **Números**: Separadores brasileiros

## 🚀 Deploy

### Vercel (Recomendado)
\`\`\`bash
# Via CLI
vercel --prod

# Via GitHub
# Push para main branch (auto-deploy)
\`\`\`

### Variáveis de Produção
\`\`\`bash
NEXT_PUBLIC_API_BASE_URL=https://api.seudominio.com
\`\`\`

## 🔧 Configurações Avançadas

### Polling Intervals
- **Pedido individual**: 3s
- **Lista de pedidos**: 10s  
- **Health check**: 30s

### Cache Strategy
- **TanStack Query**: 60s stale time
- **Retry**: 3 tentativas (exceto 404)
- **Background refetch**: Habilitado

### Error Handling
- **Error Boundary**: Captura erros React
- **API Interceptors**: Tratamento HTTP
- **Toast Notifications**: Feedback visual
- **Retry Logic**: Tentativas automáticas

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptações
- **Navegação**: Hamburger menu (mobile)
- **Tabelas**: Cards empilhados (mobile)
- **Formulários**: Layout vertical (mobile)
- **Imagens**: Lazy loading + otimização

## 🔒 Segurança

### Frontend
- **Validação**: Zod schemas
- **Sanitização**: Input cleaning
- **CORS**: Configurado no backend
- **Environment**: Variáveis seguras

### API Integration
- **Timeout**: 10s por requisição
- **Rate Limiting**: Implementado no backend
- **Error Masking**: Não exposição de detalhes

## 🐛 Troubleshooting

### Problemas Comuns

**Backend não conecta**
\`\`\`bash
# Verificar se está rodando
curl http://localhost:8080/actuator/health

# Verificar variável de ambiente
echo $NEXT_PUBLIC_API_BASE_URL
\`\`\`

**Testes falhando**
\`\`\`bash
# Limpar cache
npm test -- --clearCache

# Verificar setup
cat jest.setup.js
\`\`\`

**Build falha**
\`\`\`bash
# Verificar TypeScript
npx tsc --noEmit

# Verificar ESLint
npm run lint
\`\`\`

## 📞 Suporte

### Desenvolvimento
- **Logs**: Console do navegador
- **DevTools**: React Query Devtools
- **Health**: `/admin` → Configurações

### Produção
- **Monitoramento**: Vercel Analytics
- **Errors**: Error Boundary + Sentry (futuro)
- **Performance**: Web Vitals

## 🤝 Contribuição

1. Fork o projeto
2. Crie feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para branch (`git push origin feature/nova-funcionalidade`)
5. Abra Pull Request

### Padrões
- **Commits**: Conventional Commits
- **Código**: ESLint + Prettier
- **Testes**: Cobertura mínima 70%
- **Docs**: README atualizado

---

**Versão**: 1.0.0  
**Licença**: MIT  
**Autor**: E-commerce Team
