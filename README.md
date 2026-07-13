# Bella Fashion

Sistema de vendas online (e-commerce de moda) construído com **Angular 19 (standalone components + signals)**, **TypeScript** e **TailwindCSS**.

## Stack

- Angular 19 — standalone components, `@if`/`@for` control flow, signals
- TailwindCSS 3 — design tokens customizados (`tailwind.config.js`)
- Reactive Forms para login, cadastro (com verificação OTP e consentimento LGPD), checkout e CRUD de produtos
- `HttpClient` para consumo de uma API REST em `/api/...` (endpoints documentados abaixo)

## Como rodar

```bash
npm install
npm start
```

A aplicação sobe em `http://localhost:4200`.

### Backend de demonstração (mock)

Este projeto inclui um **mock de API embutido** (`src/app/core/mocks/mock-api.interceptor.ts`) que
intercepta todas as chamadas a `/api/...` e responde com dados de exemplo em memória — assim dá pra
testar a loja inteira (catálogo, carrinho, checkout, login, painel admin) sem precisar de um backend real.

Contas de demonstração:

| Papel | E-mail | Senha |
|---|---|---|
| Administradora | `admin@bellafashion.com.br` | `admin123` |
| Cliente | `cliente@exemplo.com` | `123456` |

Para cadastro novo (`/register`), qualquer código de 6 dígitos é aceito na etapa de OTP.

Quando tiver uma API real, basta remover o `mockApiInterceptor` do `app.config.ts` (e a pasta
`core/mocks`) — os `services` já fazem as chamadas HTTP reais para `/api/auth`, `/api/products` e
`/api/orders`, então nenhuma outra mudança é necessária.


## Estrutura

```
src/app/
├── core/
│   ├── guards/        auth.guard.ts, admin.guard.ts
│   ├── services/       auth, product, order, cart
│   └── interfaces/     product, order, user
├── shared/components/  navbar, footer, product-card
├── pages/
│   ├── home/            hero + categorias + novidades + promoções
│   ├── catalog/          busca, filtro por categoria, ordenação
│   ├── product-detail/   seleção de tamanho, quantidade, adicionar ao carrinho
│   ├── cart/             carrinho + checkout (pix / cartão / boleto)
│   ├── purchase-history/ histórico de pedidos (rota protegida)
│   ├── login/, register/ autenticação + OTP + consentimento LGPD
│   ├── admin-dashboard/  métricas, pedidos recentes, estoque baixo (rota admin)
│   ├── admin-products/   CRUD completo de produtos (rota admin)
│   └── privacy-policy/   política de privacidade (LGPD)
└── app.routes.ts
```

## Design

- Fundo `#FAF8F5`, texto `#1c1917`, tons neutros `#78716c` / `#e7e5e4`
- Tipografia: **Playfair Display** (títulos) + **Inter** (corpo)
- Acento: terracota `#C08552` para CTAs de destaque e badges de promoção

## Rotas

| Caminho | Página | Proteção |
|---|---|---|
| `/` | Home | pública |
| `/catalogo` | Catálogo | pública |
| `/produto/:id` | Detalhe do produto | pública |
| `/carrinho` | Carrinho + checkout | pública |
| `/privacidade` | Política de privacidade | pública |
| `/login`, `/register` | Autenticação | pública |
| `/pedidos` | Histórico de pedidos | autenticado |
| `/admin`, `/admin/produtos` | Painel administrativo | autenticado + admin |

## Ramificações Git sugeridas

```bash
git checkout -b login
git checkout -b home
git checkout -b catalogo
git checkout -b carrinho
git checkout -b dashboard
git checkout -b lgpd
# depois: git merge main
```
