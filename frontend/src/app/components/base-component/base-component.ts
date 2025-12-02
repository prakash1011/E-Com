import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../wishlist/wishlist';
import { CartService } from '../cart/cart';

@Component({
  selector: 'app-base-component',
  imports: [Navbar, Sidebar, RouterOutlet, CommonModule],
  templateUrl: './base-component.html',
  styleUrl: './base-component.scss',
})
export class BaseComponent {
  user: any = null;
  isAdmin = false;
  isPartner = false;
  isCustomer = false;

  wishlistCount = 0;
  cartCount = 0;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.user = decoded;
      console.log(this.user);

      this.isAdmin = decoded.role === 'admin';
      this.isPartner = decoded.role === 'partner';
      this.isCustomer = decoded.role === 'customer';

      if (this.isCustomer && this.user?.id) {
        this.syncWishlistFromLocal();
        this.loadCartCount();
      }
    }
  }

  private syncWishlistFromLocal() {
    const stored = localStorage.getItem('wishlist');
    if (!stored) return;

    let ids: number[] = [];
    try {
      ids = JSON.parse(stored);
    } catch (err) {
      console.error('Error parsing wishlist from localStorage', err);
      return;
    }

    if (!ids.length) return;

    this.wishlistService.sync(ids).subscribe({
      next: (res) => {
        this.wishlistCount = Array.isArray(res) ? res.length : ids.length;
        localStorage.removeItem('wishlist');
      },
      error: (err) => {
        console.error('Error syncing wishlist to server', err);
      },
    });
  }

  private loadCartCount() {
    if (!this.user?.id) return;
    this.cartService.getCart(this.user.id).subscribe({
      next: (cart) => {
        if (cart && Array.isArray(cart.items)) {
          this.cartCount = cart.items.length;
        } else {
          this.cartCount = 0;
        }
      },
      error: (err) => {
        console.error('Error loading cart', err);
      },
    });
  }
}
