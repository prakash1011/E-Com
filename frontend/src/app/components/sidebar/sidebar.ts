import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  user: any = null;
  isAdmin = false;
  isPartner = false;
  isCustomer = false;
  constructor(private router: Router) {}
  ngOnInit() {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.user = decoded;
      console.log(this.user);
      this.isAdmin = decoded.role === 'admin';
      this.isPartner = decoded.role === 'partner';
      this.isCustomer = decoded.role === 'customer';
    }
  }
}
