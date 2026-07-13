import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  checkoutMode = false;
  submitting = false;
  error = '';

  checkoutForm: FormGroup;

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      customer_name: ['', Validators.required],
      customer_email: [this.auth.getUser()?.email ?? '', [Validators.required, Validators.email]],
      shipping_address: ['', Validators.required],
      payment_method: ['pix', Validators.required],
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: string): void {
    this.cartService.removeItem(productId);
  }

  goToCheckout(): void {
    this.checkoutMode = true;
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = '';
    const formValue = this.checkoutForm.getRawValue();

    this.orderService
      .create({
        items: this.cartService.cartItems(),
        total: this.cartService.total(),
        status: 'pending',
        customer_name: formValue.customer_name!,
        customer_email: formValue.customer_email!,
        shipping_address: formValue.shipping_address!,
        payment_method: formValue.payment_method as 'pix' | 'credit_card' | 'boleto',
      })
      .subscribe({
        next: () => {
          this.cartService.clearCart();
          this.submitting = false;
          this.router.navigate(['/pedidos']);
        },
        error: () => {
          this.error = 'Não foi possível concluir o pedido. Tente novamente.';
          this.submitting = false;
        },
      });
  }
}
