import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private base = '/api/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.base);
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`);
  }

  getByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(this.base, { params: { category } });
  }

  getNew(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/new`);
  }

  getPromo(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/promo`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.base, product);
  }

  update(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.base}/${id}`, product);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
