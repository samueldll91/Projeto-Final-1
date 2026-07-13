import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/interfaces/order.interface';

const STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './purchase-history.component.html',
})
export class PurchaseHistoryComponent implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);
  statusLabels = STATUS_LABELS;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getMine().subscribe({
      next: (o) => { this.orders.set(o); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
