import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/interfaces/product.interface';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

interface HeroSlide {
  image: string;
  eyebrow: string;
  title: string;
  ctaLabel: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  newProducts = signal<Product[]>([]);
  promoProducts = signal<Product[]>([]);
  loadingNew = signal(true);
  loadingPromo = signal(true);

  // Hero carousel
  heroSlides: HeroSlide[] = [
    {
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
      eyebrow: 'Nova coleção',
      title: 'Elegância que se veste de você',
      ctaLabel: 'Ver coleção',
    },
    {
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80',
      eyebrow: 'Peças atemporais',
      title: 'Estilo que atravessa estações',
      ctaLabel: 'Explorar catálogo',
    },
    {
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=80',
      eyebrow: 'Feito para durar',
      title: 'Cada detalhe, pensado por você',
      ctaLabel: 'Descobrir novidades',
    },
    {
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80',
      eyebrow: 'Edição limitada',
      title: 'Acessórios que assinam seu look',
      ctaLabel: 'Ver acessórios',
    },
  ];
  currentSlide = signal(0);
  private autoplayHandle?: ReturnType<typeof setInterval>;

  categories = [
    { name: 'Vestidos', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80' },
    { name: 'Camisas', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80' },
    { name: 'Calças', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80' },
    { name: 'Tênis', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80' },
    { name: 'Acessórios', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80' },
  ];

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.productService.getNew().subscribe({
      next: (p) => { this.newProducts.set(p); this.loadingNew.set(false); },
      error: () => this.loadingNew.set(false),
    });
    this.productService.getPromo().subscribe({
      next: (p) => { this.promoProducts.set(p); this.loadingPromo.set(false); },
      error: () => this.loadingPromo.set(false),
    });

    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product);
  }

  nextSlide(): void {
    this.currentSlide.set((this.currentSlide() + 1) % this.heroSlides.length);
    this.restartAutoplay();
  }

  prevSlide(): void {
    this.currentSlide.set((this.currentSlide() - 1 + this.heroSlides.length) % this.heroSlides.length);
    this.restartAutoplay();
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
    this.restartAutoplay();
  }

  private startAutoplay(): void {
    this.autoplayHandle = setInterval(() => {
      this.currentSlide.set((this.currentSlide() + 1) % this.heroSlides.length);
    }, 6000);
  }

  private stopAutoplay(): void {
    if (this.autoplayHandle) clearInterval(this.autoplayHandle);
  }

  private restartAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }
}
