import { Component, OnInit } from '@angular/core';
import { Partner } from '../partner/partner';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-products',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  form: FormGroup;
  API = 'http://localhost:3000/products/create';
  selectedFile: File | null = null;
 user: any = null;
  isAdmin = false;
  isPartner = false;
  get partners() {
    return this.partnerService.partners;
  }

  constructor(
    private partnerService: Partner,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      assignedPartnerId: [''],
      description: [''],
    });
  }

  ngOnInit() {
    this.partnerService.loadPartners();
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.user = decoded;
      console.log(this.user);
      this.isAdmin = decoded.role === 'admin';
      this.isPartner = decoded.role === 'partner';
    }
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submit() {
    if (this.form.invalid || !this.selectedFile) {
      alert('Fill all fields and select image');
      return;
    }

    console.log('Form values:', this.form.value);
    console.log('Selected Partner ID:', this.form.value.assignedPartnerId);
    console.log(
      'Selected Partner ID type:',
      typeof this.form.value.assignedPartnerId
    );

    const formData = new FormData();
    formData.append('name', this.form.value.name);
    formData.append('price', this.form.value.price);
    formData.append('quantity', this.form.value.quantity);
    formData.append('description', this.form.value.description);
    formData.append('assignedPartnerId', this.form.value.assignedPartnerId);
    formData.append('image', this.selectedFile);

    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(key, ':', value);
    });

    this.http.post(this.API, formData).subscribe({
      next: () => {
        alert('Product created!');
        this.router.navigate(['/products']);
      },
      error: (err) => console.log(err),
    });
  }
}
