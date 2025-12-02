import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from './cart';
import { jwtDecode } from 'jwt-decode';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  image?: string;
}

interface CartItem {
  id: number; 
  quantity: number;
  product: Product;
}

interface Cart {
  items: CartItem[];
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [] };
  loading = false;
  customerId: number | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.setCustomerIdFromToken();
    if (this.customerId) {
      this.loadCart();
    }
  }

  private setCustomerIdFromToken() {
    const token = localStorage.getItem('jwt_token');
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      this.customerId = decoded.id ?? decoded.userId ?? decoded.sub ?? null;
    } catch (err) {
      console.error('Error decoding token', err);
      this.customerId = null;
    }
  }

  loadCart() {
    if (!this.customerId) return;
    this.loading = true;

    this.cartService.getCart(this.customerId).subscribe({
      next: (res: any) => {
        console.log('CART RESPONSE:', res);

        if (res && Array.isArray(res.items)) {
          this.cart = { ...res, items: res.items as CartItem[] };
        } else if (Array.isArray(res)) {
          this.cart = { items: res as CartItem[] };
        } else {
          this.cart = { items: [] };
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading cart', err);
        this.cart = { items: [] };
        this.loading = false;
      },
    });
  }

  getImageUrl(product: any): string {
    if (product?.imageUrl && product.imageUrl.startsWith('http')) {
      return product.imageUrl;
    }

    if (product?.imageUrl) {
      return `http://localhost:3000/${product.imageUrl}`;
    }

    if (product?.image && product.image.startsWith('http')) {
      return product.image;
    }

    if (product?.image) {
      return `http://localhost:3000/${product.image}`;
    }

    return 'assets/no-image.png'; 
  }

  getTotal(): number {
    return this.cart.items.reduce((sum: number, item: CartItem) => {
      const price = item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
  }

  increaseQty(item: CartItem) {
      console.log('Increase clicked for:', item); 
    if (!this.customerId) return;

    const previousQty = item.quantity;
    item.quantity = previousQty + 1;

    this.cartService
      .updateItem(this.customerId, item.id, item.quantity)
      .subscribe({
        next: () => {

        },
        error: (err) => {
          console.error('Error increasing qty', err);
          item.quantity = previousQty;
        },
      });
  }

  decreaseQty(item: CartItem) {
    if (!this.customerId) return;

    const previousQty = item.quantity;
    const newQty = previousQty - 1;

    if (newQty <= 0) {
      this.remove(item);
      return;
    }

    item.quantity = newQty;

    this.cartService
      .updateItem(this.customerId, item.id, item.quantity)
      .subscribe({
        next: () => {

        },
        error: (err) => {
          console.error('Error decreasing qty', err);
          item.quantity = previousQty;
        },
      });
  }

  remove(item: CartItem) {
    if (!this.customerId) return;

    const index = this.cart.items.indexOf(item);
    if (index > -1) {
      this.cart.items.splice(index, 1);
    }

    this.cartService.removeItem(this.customerId, item.id).subscribe({
      next: () => {
      },
      error: (err) => {
        console.error('Error removing item', err);
        this.loadCart();
      },
    });
  }

  clearCart() {
    if (!this.customerId) return;

    this.cartService.clearCart(this.customerId).subscribe({
      next: () => {
        this.cart = { items: [] };
      },
      error: (err) => {
        console.error('Error clearing cart', err);
      },
    });
  }
}
