import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface DecodedToken {
  email: string;
  role: string;
  id: number;
  name?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard {
  user: any = null;
  isAdmin = false;
  isPartner = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('jwt_token');
    if (!token) return;

    const decoded: any = jwtDecode(token);
    this.user = decoded;

    this.isAdmin = decoded.role === 'admin';
    this.isPartner = decoded.role === 'partner';

    // 👇 redirect customer — THIS SHOULD BE INSIDE ngOnInit()
    if (decoded.role === 'customer') {
      this.router.navigate(['/customer/products']);
    }
  }
}
