import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  menuOpen = false;
  userMenuOpen = false;
  search = '';

  categories = ['Vestidos', 'Camisas', 'Calças', 'Tênis', 'Acessórios'];

  constructor(
    public cart: CartService,
    public auth: AuthService,
    private router: Router
  ) {}

  onSearch(): void {
    if (!this.search.trim()) return;
    this.router.navigate(['/catalogo'], { queryParams: { q: this.search } });
    this.search = '';
    this.menuOpen = false;
  }

  logout(): void {
    this.auth.logout();
    this.userMenuOpen = false;
    this.router.navigate(['/']);
  }
}
