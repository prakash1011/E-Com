import { Component, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-partner',
  imports: [CommonModule, RouterLink],
  templateUrl: './partner.html',
  styleUrl: './partner.scss',
})
@Injectable({
  providedIn: 'root',
})
export class Partner {
  partners: any[] = [];
  loading = true;
  private readonly API = 'http://localhost:3000/partners';
  constructor(private http: HttpClient, private router: Router) {}
  ngOnInit() {
    this.loadPartners();
  }
  getPartners() {
    return this.http.get<any[]>(this.API);
  }
  loadPartners() {
    this.loading = true;
    this.http.get<any[]>(this.API).subscribe({
      next: (res) => {
        this.partners = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading partners', err);
        this.loading = false;
      },
    });
  }
  removePartner(id: number) {
    this.http.delete(`${this.API}/${id}`).subscribe({
      next: () => {
        this.loadPartners();
      },
      error: (err) => {
        console.error('Delete failed', err);
        alert('Failed to delete');
      },
    });
  }
  editPartner(id: number | string | undefined) {
    if (!id) {
      console.warn('id is not provided for edit');
      return;
    }
    this.router.navigate(['/partner', 'edit', id]);
  }
}
