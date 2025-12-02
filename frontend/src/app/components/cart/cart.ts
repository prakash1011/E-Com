import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly API = 'http://localhost:3000/cart';

  constructor(private http: HttpClient) {}

  getCart(customerId: number): Observable<any> {
    return this.http.get(`${this.API}/${customerId}`);
  }

  addToCart(customerId: number, productId: number, quantity: number = 1) {
    return this.http.post(`${this.API}/${customerId}/items`, {
      productId,
      quantity,
    });
  }

  updateItem(customerId: number, itemId: number, quantity: number) {
    return this.http.put(`${this.API}/${customerId}/items/${itemId}`, {
      quantity,
    });
  }

  removeItem(customerId: number, itemId: number) {
    return this.http.delete(`${this.API}/${customerId}/items/${itemId}`);
  }

  clearCart(customerId: number) {
    return this.http.delete(`${this.API}/${customerId}/clear`);
  }
}
