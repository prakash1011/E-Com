// forgot-password.ts (standalone)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: 'forgot-password.html',
})
export class ForgotPassword {
  serverError: string | null = null;
  successMessage: string | null = null;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  private readonly API = 'http://localhost:3000/forgot-password';

  constructor(private http: HttpClient) {}

  submit() {
    this.serverError = null;
    this.successMessage = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.http.post(this.API, this.form.value).subscribe({
      next: (res: any) => {
        this.successMessage =
          res?.message || 'Check your email for the reset link.'
      },
      error: (err) => {
        this.serverError =
          err?.error?.message || 'Failed to send reset link. Try again.';
      },
    });
  }
}
