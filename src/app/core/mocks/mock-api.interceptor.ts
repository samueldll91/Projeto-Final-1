import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { delay, of, throwError } from 'rxjs';
import { MOCK_PRODUCTS, MOCK_USERS, MOCK_ORDERS } from './mock-data';
import { Product } from '../interfaces/product.interface';
import { Order } from '../interfaces/order.interface';

// Mutable in-memory copies so create/update/delete persist during the session.
let products: Product[] = MOCK_PRODUCTS.map((p) => ({ ...p }));
let orders: Order[] = MOCK_ORDERS.map((o) => ({ ...o }));
let nextProductId = products.length + 1;
let nextOrderId = orders.length + 1;

function currentUserEmail(): string | null {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw).email : null;
  } catch {
    return null;
  }
}

/**
 * DEV-ONLY mock backend. Intercepts every call to /api/... and resolves it
 * against in-memory sample data, so the app is fully demoable without a
 * real server. Remove this interceptor (and its provider in app.config.ts)
 * once a real API is available.
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/')) {
    return next(req);
  }

  const respond = (body: unknown, status = 200) =>
    of(new HttpResponse({ status, body })).pipe(delay(250));

  const fail = (status: number, message: string) =>
    throwError(() => new HttpErrorResponse({ status, error: { message } })).pipe(delay(250));

  const url = req.url;
  const method = req.method;

  // ---- AUTH ----
  if (url === '/api/auth/login' && method === 'POST') {
    const { email, password } = req.body as { email: string; password: string };
    const user = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!user) return fail(401, 'E-mail ou senha inválidos.');
    const { password: _pw, ...safeUser } = user;
    return respond({ token: 'mock-token-' + user.id, user: safeUser });
  }

  if (url === '/api/auth/register' && method === 'POST') {
    const { email } = req.body as { email: string; password: string };
    if (MOCK_USERS.some((u) => u.email === email)) return fail(409, 'E-mail já cadastrado.');
    // Registration just triggers the OTP step; account is created on verify-otp.
    return respond({ ok: true });
  }

  if (url === '/api/auth/verify-otp' && method === 'POST') {
    const { email } = req.body as { email: string; code: string };
    const newUser = { id: 'u' + (MOCK_USERS.length + 1), email, full_name: email.split('@')[0], role: 'user' as const };
    if (!MOCK_USERS.some((u) => u.email === email)) {
      MOCK_USERS.push({ ...newUser, password: '' });
    }
    return respond({ token: 'mock-token-' + newUser.id, user: newUser });
  }

  // ---- PRODUCTS ----
  if (url === '/api/products/new' && method === 'GET') {
    return respond(products.filter((p) => p.is_new));
  }

  if (url === '/api/products/promo' && method === 'GET') {
    return respond(products.filter((p) => p.is_promo));
  }

  if (url === '/api/products' && method === 'GET') {
    const category = req.params.get('category');
    return respond(category ? products.filter((p) => p.category === category) : products);
  }

  if (url === '/api/products' && method === 'POST') {
    const newProduct: Product = { ...(req.body as Product), id: 'p' + nextProductId++ };
    products = [newProduct, ...products];
    return respond(newProduct, 201);
  }

  const productMatch = url.match(/^\/api\/products\/(.+)$/);
  if (productMatch) {
    const id = productMatch[1];
    if (method === 'GET') {
      const product = products.find((p) => p.id === id);
      return product ? respond(product) : fail(404, 'Produto não encontrado.');
    }
    if (method === 'PUT') {
      const idx = products.findIndex((p) => p.id === id);
      if (idx === -1) return fail(404, 'Produto não encontrado.');
      products[idx] = { ...products[idx], ...(req.body as Partial<Product>) };
      return respond(products[idx]);
    }
    if (method === 'DELETE') {
      products = products.filter((p) => p.id !== id);
      return respond(null, 204);
    }
  }

  // ---- ORDERS ----
  if (url === '/api/orders/me' && method === 'GET') {
    const email = currentUserEmail();
    return respond(orders.filter((o) => o.customer_email === email));
  }

  if (url === '/api/orders' && method === 'GET') {
    return respond(orders);
  }

  if (url === '/api/orders' && method === 'POST') {
    const newOrder: Order = { ...(req.body as Order), id: 'o' + nextOrderId++, created_at: new Date() };
    orders = [newOrder, ...orders];
    return respond(newOrder, 201);
  }

  const orderStatusMatch = url.match(/^\/api\/orders\/(.+)\/status$/);
  if (orderStatusMatch && method === 'PATCH') {
    const idx = orders.findIndex((o) => o.id === orderStatusMatch[1]);
    if (idx === -1) return fail(404, 'Pedido não encontrado.');
    orders[idx] = { ...orders[idx], status: (req.body as { status: Order['status'] }).status };
    return respond(orders[idx]);
  }

  return fail(404, `Mock não implementado para ${method} ${url}`);
};
