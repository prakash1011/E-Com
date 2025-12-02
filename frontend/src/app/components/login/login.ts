import { Component } from '@angular/core';
import { Auth } from '../../auth/auth';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { WishlistService } from '../../wishlist/wishlist';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  form!: FormGroup;
  serverError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
    private wishlistService: WishlistService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }

  submit() {
    this.serverError = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const credentials = this.form.value;

    this.auth.login(credentials).subscribe({
      next: (res) => {
        if (res?.access_token) {
          localStorage.setItem('jwt_token', res.access_token);

          let role: string | undefined;
          try {
            const decoded: any = jwtDecode(res.access_token);
            role = decoded.role;
          } catch (e) {
            console.error('Error decoding token in login', e);
          }
          if (role === 'customer') {
            const raw = localStorage.getItem('wishlist');
            if (raw) {
              let ids: number[] = [];
              try {
                ids = JSON.parse(raw);
              } catch (e) {
                console.error('Error parsing local wishlist', e);
              }

              if (ids.length) {
                this.wishlistService.sync(ids).subscribe({
                  next: () => {
                    console.log('Wishlist synced after login');
                    localStorage.removeItem('wishlist');
                    this.router.navigate(['/dashboard']);
                  },
                  error: (err) => {
                    console.error('Error syncing wishlist after login', err);
                    this.router.navigate(['/dashboard']);
                  },
                });
                return; // yahan se return taki neeche wala navigate dobara na chale
              }
            }
          }
        }

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login failed', err);
        this.serverError =
          err?.error?.message || err?.error || 'Invalid Email or Password';
      },
    });
  }
}
