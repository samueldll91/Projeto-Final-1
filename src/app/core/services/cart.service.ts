import { Injectable, computed, signal } from '@angular/core';
import { OrderItem } from '../interfaces/order.interface';
import { Product } from '../interfaces/product.interface';

const STORAGE_KEY = 'bella_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<OrderItem[]>(this.readStorage());

  readonly cartItems = this.items.asReadonly();

  readonly total = computed(() =>
    this.items().reduce((sum, i) => sum + i.price * i.quantity, 0)
  );

  readonly itemCount = computed(() =>
    this.items().reduce((sum, i) => sum + i.quantity, 0)
  );

  addItem(product: Product, quantity = 1): void {
    const existing = this.items().find((i) => i.product_id === product.id);
    if (existing) {
      this.updateQuantity(product.id!, existing.quantity + quantity);
      return;
    }
    const newItem: OrderItem = {
      product_id: product.id!,
      name: product.name,
      price: product.price,
      quantity,
      image_url: product.image_url,
    };
    this.items.set([...this.items(), newItem]);
    this.saveToStorage();
  }

  removeItem(productId: string): void {
    this.items.set(this.items().filter((i) => i.product_id !== productId));
    this.saveToStorage();
  }

  updateQuantity(productId: string, qty: number): void {
    if (qty <= 0) {
      this.removeItem(productId);
      return;
    }
    this.items.set(
      this.items().map((i) => (i.product_id === productId ? { ...i, quantity: qty } : i))
    );
    this.saveToStorage();
  }

  clearCart(): void {
    this.items.set([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  private saveToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
  }

  private readStorage(): OrderItem[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }
}
