import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/interfaces/product.interface';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

type SortOption = 'recent' | 'price-asc' | 'price-desc' | 'name';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './catalog.component.html',
})
export class CatalogComponent implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(true);

  // These must be signals (not plain fields) so that `filtered` — a computed()
  // — actually re-runs when they change. computed() only tracks signal reads;
  // it ignores writes to plain properties, which was why switching category
  // via the navbar didn't update the list without a full page reload.
  search = signal('');
  category = signal('Todos');
  sort = signal<SortOption>('recent');

  categories = ['Todos', 'Vestidos', 'Camisas', 'Calças', 'Tênis', 'Acessórios'];

  filtered = computed(() => {
    let list = this.products();
    const search = this.search();
    const category = this.category();
    const sort = this.sort();

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(term));
    }

    if (category !== 'Todos') {
      list = list.filter((p) => p.category === category);
    }

    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'name':
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return list;
  });

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // queryParams keeps emitting on every navigation to this route (even
    // when Angular reuses the same component instance), so this alone was
    // fine — the missing piece was making `category`/`search` reactive above.
    this.route.queryParams.subscribe((params) => {
      this.search.set(params['q'] || '');
      this.category.set(params['categoria'] || 'Todos');
    });
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getAll().subscribe({
      next: (p) => { this.products.set(p); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product);
  }
}
