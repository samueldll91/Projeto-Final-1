import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return password && confirm && password !== confirm ? { mismatch: true } : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  step = signal<'form' | 'otp'>('form');
  submitting = false;
  error = '';
  otpDigits: string[] = ['', '', '', '', '', ''];

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        lgpdConsent: [false, Validators.requiredTrue],
      },
      { validators: passwordsMatch }
    );
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.error = '';
    const { email, password } = this.registerForm.getRawValue();

    this.auth.register(email!, password!).subscribe({
      next: () => {
        this.submitting = false;
        this.step.set('otp');
      },
      error: () => {
        this.error = 'Não foi possível criar sua conta. Tente novamente.';
        this.submitting = false;
      },
    });
  }

  verifyOtp(): void {
    const code = this.otpDigits.join('');
    if (code.length !== 6) return;

    this.submitting = true;
    this.error = '';
    const email = this.registerForm.get('email')?.value ?? '';

    this.auth.verifyOtp(email, code).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/']);
      },
      error: () => {
        this.error = 'Código inválido. Verifique e tente novamente.';
        this.submitting = false;
      },
    });
  }

  onOtpInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(0, 1);
    this.otpDigits[index] = value;
    if (value && index < 5) {
      const next = input.parentElement?.children[index + 1] as HTMLInputElement | undefined;
      next?.focus();
    }
  }
}
