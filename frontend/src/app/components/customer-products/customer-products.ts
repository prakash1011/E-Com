import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../cart/cart';
import { jwtDecode } from 'jwt-decode';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  imageUrl: string;
  createdBy: {
    id: number;
    email: string;
  };
  assignedPartner: {
    id: number;
    name: string;
  } | null;
  createdAt: string;
}

@Component({
  selector: 'app-customer-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-products.html',
  styleUrl: './customer-products.scss',
})
export class CustomerProduct implements OnInit {
  products: Product[] = [];
  wishlistIDs: number[] = [];
  loading = false;
  API = 'http://localhost:3000/products/public';

  customerId: number | null = null;

  constructor(private http: HttpClient, private cartService: CartService) {}

  ngOnInit() {
    this.setCustomerIdFromToken();
    this.loadProducts();
    const wishlistItem = localStorage.getItem('wishlist');
    if (wishlistItem) {
      try {
        this.wishlistIDs = JSON.parse(wishlistItem);
      } catch (error) {
        console.error('Error parsing wishlist from localStorage', error);
        this.wishlistIDs = [];
      }
    }
  }

  private setCustomerIdFromToken() {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      console.warn('No JWT token found, customerId null');
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      this.customerId = decoded.id ?? decoded.userId ?? decoded.sub ?? null;

      if (!this.customerId) {
        console.warn('token payload:', decoded);
      }
    } catch (e) {
      console.error('Error decoding JWT', e);
      this.customerId = null;
    }
  }

  getImageUrl(p: Product): string {
    if (p.imageUrl.startsWith('http')) return p.imageUrl;
    return 'http://localhost:3000' + p.imageUrl;
  }

  loadProducts() {
    this.loading = true;
    this.http.get<Product[]>(this.API).subscribe({
      next: (data) => {
        this.products = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.loading = false;
      },
    });
  }

  addToCart(product: Product) {
    if (!this.customerId) {
      alert('Please login as customer to add to cart');
      return;
    }

    this.cartService.addToCart(this.customerId, product.id, 1).subscribe({
      next: () => alert(`Added "${product.name}" to cart`),
      error: (err) => {
        console.error('Error adding to cart', err);
        alert('Failed to add to cart');
      }, 
    });
  }

  isProductWishlisted(product: Product): boolean {
    return this.wishlistIDs.includes(product.id);
  }

  toggleHeart(product: Product): void {
    const id = product.id;

    const index = this.wishlistIDs.indexOf(id);

    if (index > -1) {
      this.wishlistIDs.splice(index, 1);
    } else {
      this.wishlistIDs.push(id);
    }

    localStorage.setItem('wishlist', JSON.stringify(this.wishlistIDs));

    console.log('Current wishlist:', this.wishlistIDs);
  }
}
