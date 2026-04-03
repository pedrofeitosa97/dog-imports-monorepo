# Dog Imports

E-commerce de produtos importados de luxo — roupas, calçados e acessórios das principais marcas internacionais.

**Frontend** hospedado na Vercel · **API** hospedada no Railway · **Imagens** no AWS S3

---

## Índice

- [Visão geral](#visão-geral)
- [Stack tecnológica](#stack-tecnológica)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Configuração local](#configuração-local)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Painel administrativo](#painel-administrativo)
- [Deploy em produção](#deploy-em-produção)
- [API Reference](#api-reference)

---

## Visão geral

Dog Imports é um monorepo com frontend React e API NestJS separados. O cliente navega pelo catálogo, adiciona produtos ao carrinho e finaliza a compra. O lojista gerencia tudo pelo painel `/admin` — produtos, pedidos, banners, e-mails e configurações do site.

---

## Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend | React 18, TypeScript, Vite, Styled Components, React Router v6 |
| Backend | NestJS 10, TypeORM, Passport JWT |
| Banco de dados | PostgreSQL (produção) · SQLite (desenvolvimento local) |
| Armazenamento | AWS S3 |
| E-mail | Resend |
| Deploy frontend | Vercel |
| Deploy backend | Railway |

---

## Arquitetura

```
dog-imports-monorepo/
├── front/          # React SPA (Vercel)
└── back/           # NestJS REST API (Railway)
```

```
Usuário → Vercel (React) → Railway (NestJS API) → PostgreSQL
                                    ↓                  ↓
                                  AWS S3            Resend
                               (imagens)           (e-mails)
```

O frontend consome a API via `VITE_API_URL`. Toda autenticação usa JWT com Bearer token armazenado no `localStorage`.

---

## Pré-requisitos

- **Node.js** 20+
- **npm** 9+ (backend) e **yarn** (frontend)

---

## Configuração local

### 1. Clone o repositório

```bash
git clone https://github.com/pedrofeitosa97/dog-imports-monorepo.git
cd dog-imports-monorepo
```

### 2. Configure as variáveis de ambiente

**Backend:**
```bash
cp back/.env.example back/.env
```

Edite `back/.env` e defina ao menos o `JWT_SECRET`:
```bash
# Gere uma chave segura:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Frontend:**
```bash
cp front/.env.example front/.env
```

O valor padrão `http://localhost:8000/api` já funciona para desenvolvimento local.

### 3. Instale as dependências

```bash
# Backend
cd back && npm install

# Frontend (em outro terminal)
cd front && yarn install
```

### 4. Inicie os servidores

```bash
# Backend (http://localhost:8000)
cd back && npm run start:dev

# Frontend (http://localhost:3000)
cd front && yarn dev
```

Na primeira execução, o banco SQLite é criado automaticamente com dados de exemplo:

| Campo | Valor |
|---|---|
| Admin e-mail | `admin@dogimports.com` |
| Admin senha | `admin123` |

> Troque a senha do admin pelo painel `/admin/usuarios` antes de ir para produção.

---

## Variáveis de ambiente

### Backend (`back/.env`)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `PORT` | Não | Porta da API. Padrão: `8000` |
| `NODE_ENV` | Não | `development` ou `production`. Railway define automaticamente |
| `JWT_SECRET` | **Sim** | Chave secreta para assinar os tokens. Mínimo 16 caracteres. O servidor não inicia sem ela |
| `DATABASE_URL` | Não | URL do PostgreSQL. Sem ela, usa SQLite local |
| `FRONTEND_URL` | Não | URL do frontend para CORS. Sem ela, aceita qualquer origem |
| `AWS_ACCESS_KEY_ID` | Não | Credencial AWS para upload de imagens |
| `AWS_SECRET_ACCESS_KEY` | Não | Credencial AWS para upload de imagens |
| `AWS_REGION` | Não | Região do bucket S3. Ex: `us-east-1` |
| `AWS_S3_BUCKET` | Não | Nome do bucket S3 |
| `STRIPE_SECRET_KEY` | Não | Chave secreta Stripe (`sk_test_...` ou `sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Não | Segredo do webhook Stripe (`whsec_...`) |
| `RESEND_API_KEY` | Não | API Key do Resend para envio de e-mails |

### Frontend (`front/.env`)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_API_URL` | **Sim** | URL base da API (sem barra no final). Ex: `http://localhost:8000/api` |
| `VITE_STRIPE_PUBLIC_KEY` | Não | Chave pública Stripe (`pk_test_...` ou `pk_live_...`) |

---

## Estrutura do projeto

```
dog-imports-monorepo/
│
├── back/                          # API NestJS
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/              # Login, registro, JWT
│   │   │   ├── users/             # Usuários e admins
│   │   │   ├── products/          # Catálogo de produtos
│   │   │   ├── categories/        # Categorias
│   │   │   ├── orders/            # Pedidos
│   │   │   ├── banners/           # Banners da homepage
│   │   │   ├── popups/            # Pop-ups promocionais
│   │   │   ├── email/             # Envio de e-mails (Resend)
│   │   │   ├── stripe/            # Pagamentos (Stripe PaymentIntents + Webhook)
│   │   │   ├── settings/          # Configurações do site
│   │   │   └── s3/                # Upload para AWS S3
│   │   ├── common/
│   │   │   ├── decorators/        # @Public, @CurrentUser
│   │   │   └── guards/            # JwtAuthGuard
│   │   ├── database/
│   │   │   └── seed.service.ts    # Dados iniciais
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example
│   └── railway.toml
│
└── front/                         # SPA React
    ├── src/
    │   ├── pages/
    │   │   ├── admin/             # Painel administrativo
    │   │   │   ├── DashboardPage/
    │   │   │   ├── OrdersPage/
    │   │   │   ├── ProductsListPage/
    │   │   │   ├── ProductCreatePage/
    │   │   │   ├── ProductEditPage/
    │   │   │   ├── CategoryPage/
    │   │   │   ├── BannerPage/
    │   │   │   ├── PopupPage/
    │   │   │   ├── EmailPage/
    │   │   │   ├── AdminUsersPage/
    │   │   │   └── SettingsPage/
    │   │   ├── HomePage/
    │   │   ├── ProductListingPage/
    │   │   ├── ProductDetailPage/
    │   │   ├── CartPage/
    │   │   ├── CheckoutPage/
    │   │   ├── OrderConfirmationPage/
    │   │   └── AccountPage/
    │   ├── services/              # Chamadas à API (axios)
    │   ├── hooks/                 # Custom hooks (auth, cart, toast...)
    │   ├── contexts/              # Context API (cart, auth)
    │   ├── layouts/               # PublicLayout, AdminLayout, AuthLayout
    │   ├── ui/                    # Componentes reutilizáveis
    │   └── types/                 # Interfaces TypeScript
    └── .env.example
```

---

## Funcionalidades

### Loja

- Catálogo com filtros por categoria, marca, tamanho, cor, gênero e preço
- Busca de produtos
- Página de detalhes com seleção de tamanho e cor
- Carrinho persistente (localStorage)
- Lista de favoritos
- Checkout com endereço de entrega e método de pagamento (PIX, Cartão, Boleto)
- Pagamento por cartão processado diretamente pelo Stripe (PCI-compliant)
- Confirmação de pagamento via webhook Stripe
- Confirmação de pedido com timeline de status
- Área do cliente (`/minha-conta`) com histórico de pedidos

### Autenticação

- Registro e login de clientes
- Login de administradores (`/admin/login`)
- JWT com expiração de 30 dias

---

## Painel administrativo

Acesse em `/admin`. Requer conta com `isAdmin: true`.

| Seção | Rota | Descrição |
|---|---|---|
| Dashboard | `/admin` | Estatísticas do catálogo e produtos recentes |
| Pedidos | `/admin/pedidos` | Lista e atualização de status dos pedidos |
| Produtos | `/admin/produtos` | CRUD completo do catálogo |
| Categorias | `/admin/categorias` | Gerenciamento de categorias |
| Banners | `/admin/banners` | Banners da homepage |
| Popups | `/admin/popups` | Pop-ups promocionais |
| E-mails | `/admin/emails` | Templates e disparo de e-mails (Resend) |
| Administradores | `/admin/usuarios` | Criação de novos admins |
| Configurações | `/admin/configuracoes` | Logos e favicon do site |

---

## Deploy em produção

### Backend — Railway

1. Crie um novo projeto no [Railway](https://railway.app)
2. Adicione um serviço **PostgreSQL** ao projeto
3. Conecte o repositório GitHub e selecione o diretório `back/`
4. Configure as variáveis de ambiente na aba **Variables**:

```
NODE_ENV=production
JWT_SECRET=<sua-chave-gerada>
DATABASE_URL=<url-do-postgresql-railway>
FRONTEND_URL=<url-do-vercel>
AWS_ACCESS_KEY_ID=<sua-chave>
AWS_SECRET_ACCESS_KEY=<sua-chave>
AWS_REGION=us-east-1
AWS_S3_BUCKET=<nome-do-bucket>
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=<sua-chave>
```

O arquivo `back/railway.toml` já define o comando de build e start automaticamente.

### Frontend — Vercel

1. Importe o repositório no [Vercel](https://vercel.com)
2. Defina **Root Directory** como `front/`
3. Framework: **Vite**
4. Configure a variável de ambiente:

```
VITE_API_URL=https://<seu-servico>.up.railway.app/api
```

5. Configure a variável pública do Stripe:

```
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

6. Deploy

---

## Stripe — Pagamentos

### Teste local

1. Instale a [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Faça login: `stripe login`
3. Inicie o forward para receber webhooks localmente:

```bash
stripe listen --forward-to localhost:8000/api/stripe/webhook
```

4. Copie o `whsec_...` exibido e adicione em `back/.env`:

```
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Cartões de teste

| Número | Resultado |
|---|---|
| `4242 4242 4242 4242` | Pagamento aprovado |
| `4000 0000 0000 0002` | Cartão recusado |
| `4000 0025 0000 3155` | Requer autenticação 3D Secure |

Use qualquer data futura, qualquer CVC e qualquer CEP.

### Fluxo de pagamento

```
Checkout → POST /stripe/payment-intent → clientSecret
         → stripe.confirmCardPayment(clientSecret)
         → POST /orders (com stripePaymentIntentId)
         → Stripe webhook → payment_intent.succeeded
         → Order.paymentStatus = 'paid' + status = 'confirmado'
```

---

## API Reference

Com o backend rodando localmente, a documentação Swagger está disponível em:

```
http://localhost:8000/api/docs
```

### Principais endpoints

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST` | `/api/auth/login` | — | Login |
| `POST` | `/api/auth/register` | — | Cadastro |
| `GET` | `/api/auth/me` | JWT | Dados do usuário logado |
| `GET` | `/api/products` | — | Listar produtos (com filtros) |
| `GET` | `/api/products/:slug` | — | Detalhe de produto |
| `POST` | `/api/products` | Admin | Criar produto |
| `PUT` | `/api/products/:id` | Admin | Editar produto |
| `DELETE` | `/api/products/:id` | Admin | Remover produto |
| `GET` | `/api/categories` | — | Listar categorias |
| `POST` | `/api/orders` | JWT | Criar pedido |
| `GET` | `/api/orders/my` | JWT | Pedidos do cliente |
| `GET` | `/api/orders` | Admin | Todos os pedidos |
| `PATCH` | `/api/orders/:id/status` | Admin | Atualizar status |
| `GET` | `/api/settings` | — | Configurações públicas do site |
| `GET` | `/api/email/status` | Admin | Status da integração Resend |
| `POST` | `/api/email/send-order/:id` | Admin | Reenviar e-mail de pedido |
| `POST` | `/api/stripe/payment-intent` | — | Criar PaymentIntent (cartão/PIX/boleto) |
| `POST` | `/api/stripe/webhook` | Stripe | Webhook de eventos de pagamento |
