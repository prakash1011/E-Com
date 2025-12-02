import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-expert',
  imports: [CommonModule,RouterLink],
  templateUrl: './expert.html',
  styleUrl:'./expert.scss'
})
export class Expert {
  experts: any[] = [];
  loading = true;
  private readonly API = 'http://localhost:3000/expert';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadExperts();
  }

  loadExperts() {
    this.loading = true;
    this.http.get<any[]>(this.API).subscribe({
      next: (res) => {
        this.experts = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading experts', err);
        this.loading = false;
      },
    });
  }

  removeExpert(id: number) {
    this.http.delete(`${this.API}/${id}`).subscribe({
      next: () => {
        this.loadExperts();
      },
      error: (err) => {
        console.error('Delete failed', err);
        alert('Failed to delete');
      },
    });
  }

  editExpert(id: number | string | undefined) {
    if (!id) {
      console.warn('id is not provided for edit');
      return;
    }
    this.router.navigate(['/expert', 'edit', id]);
  }
}
