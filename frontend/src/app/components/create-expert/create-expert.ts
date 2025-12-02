import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-expert',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-expert.html',
})
export class CreateExpert {
  form: FormGroup;
  submitting = false;
  serverError: string | null = null;
  successMessage: string | null = null;

  private readonly API = 'http://localhost:3000/expert/create';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      phoneNo: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: [''],
      notes: [''],
    });
  }

  get name() {
    return this.form.get('name');
  }
  get phoneNo() {
    return this.form.get('phoneNo');
  }
  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }

  submit() {
    this.serverError = null;
    this.successMessage = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    const payload = {
      user: {
        email: formValue.email,
        password: formValue.password,
        role_id: 3,
      },
      expert: {
        name: formValue.name,
        phoneNo: formValue.phoneNo,
        address: formValue.address,
        notes: formValue.notes,
      },
    };

    this.submitting = true;

    this.http
      .post<{ userId: number; expertId: number }>(this.API, payload)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: (res) => {
          this.successMessage = 'Expert created successfully';
          this.router.navigate(['/expert']);
        },
        error: (err) => {
          this.serverError = err?.error?.message || 'Failed to create expert';
        },
      });
  }
}
