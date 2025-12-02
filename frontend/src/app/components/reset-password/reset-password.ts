import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: 'reset-password.html',
})
export class ResetPassword {
  token = '';
  submitting = false;
  serverError: string | null = null;

  form = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.route.queryParamMap.subscribe(
      (p) => (this.token = p.get('token') ?? '')
    );
  }

  get password() {
    return this.form.get('password');
  }
  submit() {
    this.serverError = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.token) {
      this.serverError = 'Invalid or missing token';
      return;
    }
    this.submitting = true;
    const payload = {
      token: this.token,
      newPassword: this.password?.value,
    };
    this.http
      .post('http://localhost:3000/reset-password', payload)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/login'], { replaceUrl: true });
        },
        error: (err) => {
          this.serverError =
            err?.error?.message || 'Failed to reset password. Try again.';
        },
      });
  }
}
