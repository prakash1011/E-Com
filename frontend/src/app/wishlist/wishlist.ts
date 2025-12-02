// src/app/components/wishlist/wishlist.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private API = 'http://localhost:3000/wishlist';

  constructor(private http: HttpClient) {}

  sync(productIds: number[]) {
    return this.http.post<any[]>(`${this.API}/sync`, { productIds });
  }

  getMyWishlist() {
    return this.http.get<any[]>(this.API);
  }
}
