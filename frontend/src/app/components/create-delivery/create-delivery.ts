import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
interface Partner {
  id: number;
  name: string;
  address: string;
  user?: { id?: number };
}
interface Product {
  id: number;
  name: string;
  price?: string;
  quantity?: number;
  assignedPartner?: any;
}
interface Expert {
  id: number;
  name: string;
}
@Component({
  selector: 'app-create-delivery',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-delivery.html',
  styleUrls: ['./create-delivery.scss'],
})
export class CreateDelivery {
  partnerAPI = 'http://localhost:3000/partners';
  allProductsAPI = 'http://localhost:3000/products';
  expertAPI = 'http://localhost:3000/expert';
  form: FormGroup;
  partners: Partner[] = [];
  allProducts: Product[] = [];
  products: Product[] = [];
  experts: Expert[] = [];
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      selectedPartnerId: [null],
      selectedProductId: [null, Validators.required],
      senderFirstName: ['', Validators.required],
      senderPhone: ['', Validators.required],
      receiverFirstName: ['', Validators.required],
      receiverPhone: ['', Validators.required],
      deliveryAddress: ['', Validators.required],
      notes: [''],
      pickupAddress: ['', Validators.required],
      pickupDate: ['', Validators.required],
      assignedExpertId: [null],
      senderLastName: ['', Validators.required],
      receiverLastName: ['', Validators.required],
    });
  }
  ngOnInit() {
    console.log('CreateDelivery init');
    this.loadPartners();
    this.loadExperts();
    this.loadAllProducts();
  }
  loadPartners() {
    this.http.get<Partner[]>(this.partnerAPI).subscribe({
      next: (data) => {
        this.partners = data || [];
        console.log('partners loaded', this.partners);
      },
      error: (err) => {
        console.error('partners load failed', err);
      },
    });
  }
  loadExperts() {
    this.http.get<Expert[]>(this.expertAPI).subscribe({
      next: (data) => {
        this.experts = data || [];
        console.log('experts loaded', this.experts);
      },
      error: (err) => console.error('experts load failed', err),
    });
  }
  loadAllProducts() {
    this.http.get<Product[]>(this.allProductsAPI).subscribe({
      next: (data) => {
        this.allProducts = data || [];
        const pid = this.form.get('selectedPartnerId')!.value;
        this.filterProductsForPartner(pid);
      },
      error: (err) => {
        console.error('all products load failed', err);
      },
    });
  }
  onPartnerChange(event: any) {
    const partnerId = event.target.value;
    this.filterProductsForPartner(partnerId);
    const partner = this.partners.find((p) => p.id === Number(partnerId));
    if (partner && partner?.address) {
      this.form.get('pickupAddress')!.setValue(partner.address ?? '');
    }
  }
  filterProductsForPartner(partnerId: number) {
    if (!partnerId) {
      this.products = [];
      return;
    }

    this.products = this.allProducts.filter((p) => {
      return p.assignedPartner?.id === Number(partnerId);
    });

    const selected = this.form.get('selectedProductId')!.value;
    if (selected && !this.products.find((pr) => pr.id === selected)) {
      this.form.get('selectedProductId')!.setValue(null);
    }
  }
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.warn('form invalid', this.form.value);
      return;
    }
    const v = this.form.value;
    const payload = {
      assignedPartnerId: Number(v.selectedPartnerId),
      productId: v.selectedProductId,
      pickupAddress: v.pickupAddress,
      deliveryAddress: v.deliveryAddress,
      pickupDate: v.pickupDate
        ? new Date(v.pickupDate).toISOString()
        : new Date().toISOString(),
      notes: v.notes || null,
      sender: {
        firstName: v.senderFirstName,
        lastName: v.senderLastName,
        phone: v.senderPhone,
      },
      receiver: {
        firstName: v.receiverFirstName,
        lastName: v.receiverLastName,
        phone: v.receiverPhone,
      },
      assignedExpertId: v.assignedExpertId,
    };
    delete payload.assignedExpertId;
    console.log('submitting payload', payload);
    this.http.post('http://localhost:3000/deliveries', payload).subscribe({
      next: () => {
        alert('Delivery created');
        this.router.navigate(['/deliveries']);
      },
      error: (err) => {
        console.error('create failed', err);
        alert('Create delivery failed');
      },
    });
  }
}
