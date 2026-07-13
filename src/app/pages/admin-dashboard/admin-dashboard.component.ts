import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { Order } from '../../core/interfaces/order.interface';
import { Product } from '../../core/interfaces/product.interface';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  loading = signal(true);
  stats = signal({ revenue: 0, orders: 0, products: 0, customers: 0 });
  recentOrders = signal<Order[]>([]);
  lowStock = signal<Product[]>([]);

  constructor(private orderService: OrderService, private productService: ProductService) {}

  ngOnInit(): void {
    forkJoin({
      orders: this.orderService.getAll(),
      products: this.productService.getAll(),
    }).subscribe({
      next: ({ orders, products }) => {
        const revenue = orders
          .filter((o) => o.status !== 'cancelled')
          .reduce((sum, o) => sum + o.total, 0);

        const customers = new Set(orders.map((o) => o.customer_email)).size;

        this.stats.set({
          revenue,
          orders: orders.length,
          products: products.length,
          customers,
        });

        this.recentOrders.set(
          [...orders]
            .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
            .slice(0, 5)
        );

        this.lowStock.set(products.filter((p) => p.stock_quantity <= 5));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
