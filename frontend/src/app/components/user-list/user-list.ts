import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './user-list.html',
  styleUrls:['./user-list.scss']
})
export class UserList {
  users: any[] = [];
  loading = false;
  private readonly API = 'http://localhost:3000/users'; 
  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.load();
  }
  load(withDeleted = false) {
    this.loading = true;
    const url = withDeleted ? `${this.API}?withDeleted=true` : this.API;
    this.http.get<any[]>(url).subscribe({
      next: (res) => {
        this.users = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.loading = false;
      },
    });
  }
}
