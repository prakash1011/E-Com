// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { Router, RouterModule } from '@angular/router';

// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   quantity: number;
//   description: string;
//   imageUrl: string;
//   createdBy: {
//     id: number;
//     email: string;
//   };
//   assignedPartner: {
//     id: number;
//     name: string;
//   };
//   createdAt: string;
// }

// @Component({
//   selector: 'app-product-list',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './product-list.html',
//   styleUrl: './product-list.scss',
// })
// export class ProductList implements OnInit {
//   products: Product[] = [];
//   loading = false;
//   API = 'http://localhost:3000/products';
//   constructor(private http: HttpClient, private router: Router) {}

//   ngOnInit() {
//     this.loadProducts();
//   }

//   loadProducts() {
//     this.loading = true;
//     this.http.get<Product[]>(this.API).subscribe({
//       next: (data) => {
//         this.products = data;
//         console.log("data in productlist ts",data)
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error('Error loading products', err);
//         this.loading = false;
//         alert('Failed to load products');
//       },
//     });
//   }

//   createProduct() {
//     this.router.navigate(['/products/create']);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
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
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  products: Product[] = [];
  loading = false;
  user: any = null;
  isAdmin = false;
  isPartner = false;
  API = 'http://localhost:3000/products';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadProducts();
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.user = decoded;
      console.log(this.user);
      this.isAdmin = decoded.role === 'admin';
      this.isPartner = decoded.role === 'partner';
    }
  }

  loadProducts() {
    this.loading = true;
    this.http.get<Product[]>(this.API).subscribe({
      next: (data) => {
        this.products = data;
        console.log('data in productlist ts', data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.loading = false;
        alert('Failed to load products');
      },
    });
  }

  createProduct() {
    this.router.navigate(['/products/create']);
  }

  // viewProduct(id: number) {
  //   this.router.navigate(['/products', id]);
  // }

  editProduct(id: number) {
    this.router.navigate(['/products/edit', id]);
  }

  deleteProduct(id: number) {
    const product = this.products.find((p) => p.id === id);
    if (!product) return;

    this.http.delete(`${this.API}/${id}`).subscribe({
      next: () => {
        alert('Product deleted successfully');
        this.products = this.products.filter((p) => p.id !== id);
      },
      error: (err) => {
        console.error('Error deleting product', err);
        if (err.status === 403) {
          alert('You do not have permission to delete this product');
        } else if (err.status === 404) {
          alert('Product not found');
        } else {
          console.log('Error in deleting products');
        }
      },
    });
  }
}
