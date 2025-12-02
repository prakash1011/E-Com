import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

interface Delivery {
  id: number;
  pickupAddress: string;
  deliveryAddress: string;
  pickupDate: string;
  deliveredDate?: string | null;
  deliveryTime?: number | null;
  notes?: string | null;
  status?: string;
  failureReason?: string | null;
  product?: {
    id: number;
    name: string;
    price?: string;
    imageUrl?: string | null;
  } | null;
  assignedPartner?: {
    id: number;
    name: string;
  } | null;
  sender?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  } | null;
  receiver?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-delivery-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './delivery-list.html',
  styleUrls: ['./delivery-list.scss'],
})
export class DeliveryList implements OnInit {
  deliveries: Delivery[] = [];
  user: any = null;
  isAdmin = false;
  isPartner = false;
  loading = false;
  API = 'http://localhost:3000/deliveries';
  showReasonModal = false;
  selectedDelivery: Delivery | null = null;
  failureReason = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.user = decoded;
      this.isAdmin = decoded.role === 'admin';
      this.isPartner = decoded.role === 'partner';
      console.log('isAdmin set to:', this.isAdmin);
    }

    this.loadDeliveries();
  }

  showActions(delivery: Delivery): boolean {
    return !this.isDelivered(delivery) && !this.isFailed(delivery);
  } 

  loadDeliveries() {
    this.loading = true;
    this.http.get<Delivery[]>(this.API).subscribe({
      next: (data) => {
        this.deliveries = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading deliveries', err);
        this.loading = false;
      },
    });
  }

  markAsDelivered(delivery: Delivery) {
    const deliveredDate = new Date();
    const pickupDate = new Date(delivery.pickupDate);
    const deliveryTimeInMinutes = Math.floor(
      (deliveredDate.getTime() - pickupDate.getTime()) / (1000 * 60)
    );

    const updateData = {
      deliveredDate: deliveredDate.toISOString(),
      deliveryTime: deliveryTimeInMinutes,
      status: 'delivered',
      failureReason: null,
    };

    this.http.patch(`${this.API}/${delivery.id}`, updateData).subscribe({
      next: () => {
        alert('Delivery marked as delivered!');
        const index = this.deliveries.findIndex((d) => d.id === delivery.id);
        if (index !== -1) {
          this.deliveries[index] = {
            ...this.deliveries[index],
            ...updateData,
          };
        }
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Failed to mark as delivered');
      },
    });
  }

  openFailureModal(delivery: Delivery) {
    this.selectedDelivery = delivery;
    this.failureReason = '';
    this.showReasonModal = true;
  }

  closeFailureModal() {
    this.showReasonModal = false;
    this.selectedDelivery = null;
    this.failureReason = '';
  }

  submitFailure() {
    if (!this.failureReason.trim()) {
      alert('Please enter a reason');
      return;
    }

    if (!this.selectedDelivery) return;

    const updateData = {
      status: 'failed',
      failureReason: this.failureReason,
      deliveredDate: null,
      deliveryTime: null,
    };

    this.http
      .patch(`${this.API}/${this.selectedDelivery.id}`, updateData)
      .subscribe({
        next: () => {
          alert('Delivery marked as not delivered');
          const index = this.deliveries.findIndex(
            (d) => d.id === this.selectedDelivery!.id
          );
          if (index !== -1) {
            this.deliveries[index] = {
              ...this.deliveries[index],
              ...updateData,
            };
          }
          this.closeFailureModal();
        },
        error: (err) => {
          console.error('Error:', err);
          alert('Failed to update delivery');
        },
      });
  }

  formatTime(minutes?: number | null): string {
    if (!minutes) return '—';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }

  isDelivered(delivery: Delivery): boolean {
    return delivery.status === 'delivered';
  }

  isFailed(delivery: Delivery): boolean {
    return delivery.status === 'failed';
  }

  isPending(delivery: Delivery): boolean {
    return !delivery.status || delivery.status === 'pending';
  }
}
