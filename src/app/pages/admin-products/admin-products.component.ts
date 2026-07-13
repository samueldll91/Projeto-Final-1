import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/interfaces/product.interface';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ReactiveFormsModule],
  templateUrl: './admin-products.component.html',
})
export class AdminProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(true);
  modalOpen = signal(false);
  editingProduct: Product | null = null;
  saving = false;

  categories: Product['category'][] = ['Vestidos', 'Camisas', 'Calças', 'Tênis', 'Acessórios'];

  productForm: FormGroup;

  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
      original_price: [0],
      category: ['Vestidos' as Product['category'], Validators.required],
      stock_quantity: [0, [Validators.required, Validators.min(0)]],
      image_url: [''],
      is_new: [false],
      is_promo: [false],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getAll().subscribe({
      next: (p) => { this.products.set(p); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  openModal(product?: Product): void {
    this.editingProduct = product ?? null;
    if (product) {
      this.productForm.patchValue(product);
    } else {
      this.productForm.reset({
        name: '', description: '', price: 0, original_price: 0,
        category: 'Vestidos', stock_quantity: 0, image_url: '', is_new: false, is_promo: false,
      });
    }
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.editingProduct = null;
  }

  save(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    const value = this.productForm.getRawValue() as Product;

    const request$ = this.editingProduct?.id
      ? this.productService.update(this.editingProduct.id, value)
      : this.productService.create(value);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.closeModal();
        this.loadProducts();
      },
      error: () => { this.saving = false; },
    });
  }

  delete(id: string): void {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    this.productService.delete(id).subscribe(() => this.loadProducts());
  }
}
