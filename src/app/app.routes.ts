import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Bella Fashion — Moda com elegância',
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./pages/catalog/catalog.component').then((m) => m.CatalogComponent),
    title: 'Catálogo — Bella Fashion',
  },
  {
    path: 'produto/:id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail.component').then((m) => m.ProductDetailComponent),
    title: 'Produto — Bella Fashion',
  },
  {
    path: 'carrinho',
    loadComponent: () => import('./pages/cart/cart.component').then((m) => m.CartComponent),
    title: 'Carrinho — Bella Fashion',
  },
  {
    path: 'privacidade',
    loadComponent: () =>
      import('./pages/privacy-policy/privacy-policy.component').then((m) => m.PrivacyPolicyComponent),
    title: 'Política de Privacidade — Bella Fashion',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
    title: 'Entrar — Bella Fashion',
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then((m) => m.RegisterComponent),
    title: 'Criar conta — Bella Fashion',
  },
  {
    path: 'pedidos',
    loadComponent: () =>
      import('./pages/purchase-history/purchase-history.component').then((m) => m.PurchaseHistoryComponent),
    canActivate: [authGuard],
    title: 'Meus Pedidos — Bella Fashion',
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
    canActivate: [authGuard, adminGuard],
    title: 'Painel Admin — Bella Fashion',
  },
  {
    path: 'admin/produtos',
    loadComponent: () =>
      import('./pages/admin-products/admin-products.component').then((m) => m.AdminProductsComponent),
    canActivate: [authGuard, adminGuard],
    title: 'Produtos — Admin Bella Fashion',
  },
  { path: '**', redirectTo: '' },
];
