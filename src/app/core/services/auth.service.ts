import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(this.readStoredUser());

  constructor(private http: HttpClient) {}

  get user() {
    return this.currentUser.asReadonly();
  }

  login(email: string, password: string): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>('/api/auth/login', { email, password }).pipe(
      tap((res) => this.persistSession(res.token, res.user))
    );
  }

  register(email: string, password: string, full_name?: string): Observable<{ token: string; user: User }> {
    return this.http
      .post<{ token: string; user: User }>('/api/auth/register', { email, password, full_name })
      .pipe(tap((res) => this.persistSession(res.token, res.user)));
  }

  verifyOtp(email: string, code: string): Observable<{ token: string; user: User }> {
    return this.http
      .post<{ token: string; user: User }>('/api/auth/verify-otp', { email, code })
      .pipe(tap((res) => this.persistSession(res.token, res.user)));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  getUser(): User | null {
    return this.currentUser();
  }

  private persistSession(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  private readStoredUser(): User | null {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as User) : null;
  }
}
