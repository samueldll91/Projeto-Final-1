import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/interfaces/product.interface';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(true);
  selectedSize: string | null = null;
  quantity = 1;
  justAdded = signal(false);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.productService.getById(id).subscribe({
      next: (p) => {
        this.product.set(p);
        this.selectedSize = p.sizes?.[0] ?? null;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  increment(): void {
    const p = this.product();
    if (p && this.quantity < p.stock_quantity) this.quantity++;
  }

  decrement(): void {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart(): void {
    const p = this.product();
    if (!p) return;
    this.cartService.addItem(p, this.quantity);
    this.justAdded.set(true);
    setTimeout(() => this.justAdded.set(false), 2000);
  }
}
