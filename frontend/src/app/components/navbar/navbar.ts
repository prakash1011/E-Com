import { Component, OnInit } from '@angular/core';
import { Auth } from '../../auth/auth';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../cart/cart';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  cartCount = 0;
  customerId: number | null = null;

  constructor(
    private auth: Auth,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('jwt_token');
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      // sirf customer ke liye cart
      if (decoded.role === 'customer') {
        this.customerId = decoded.id ?? decoded.userId ?? decoded.sub ?? null;
        if (this.customerId) {
          this.cartService.getCart(this.customerId).subscribe({
            next: (cart: any) => {
              this.cartCount = Array.isArray(cart.items)
                ? cart.items.reduce(
                    (sum: number, item: any) => sum + (item.quantity || 0),
                    0
                  )
                : 0;
            },
            error: (err) =>
              console.error('Error loading navbar cart count', err),
          });
        }
      }
    } catch (e) {
      console.error('Error decoding token in navbar', e);
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
