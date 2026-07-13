import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../interfaces/order.interface';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private base = '/api/orders';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.base);
  }

  getMine(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.base}/me`);
  }

  getById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.base}/${id}`);
  }

  create(order: Order): Observable<Order> {
    return this.http.post<Order>(this.base, order);
  }

  updateStatus(id: string, status: Order['status']): Observable<Order> {
    return this.http.patch<Order>(`${this.base}/${id}/status`, { status });
  }
}
