// edit-expert.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-edit-expert',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-expert.html',
  styleUrls: ['./edit-expert.scss'],
})
export class EditExpert {
  form: FormGroup;
  loading = false; // loading while fetching existing expert
  submitting = false; // while saving
  serverError: string | null = null; // generic server message
  fieldErrors: Record<string, string> = {}; // field-level server errors
  successMessage: string | null = null;
  expertId?: number;
  private readonly API = 'http://localhost:3000/expert'; // base

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      phoneNo: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      notes: [''],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      const id = idParam ? Number(idParam) : NaN;
      if (!id || Number.isNaN(id)) {
        console.warn('Invalid expert id:', idParam);
        this.router.navigate(['/expert']);
        return;
      }
      this.expertId = id;
      this.loadExpert();
    });
  }

  loadExpert() {
    if (!this.expertId) return;
    this.loading = true;
    this.serverError = null;
    this.fieldErrors = {};

    this.http
      .get<any>(`${this.API}/${this.expertId}`)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          if (!res) {
            this.serverError = 'Expert not found';
            return;
          }
          this.form.patchValue({
            name: res.name ?? '',
            phoneNo: res.phoneNo ?? '',
            email: res.user?.email ?? '',
            address: res.address ?? '',
            notes: res.notes ?? '',
          });
        },
        error: (err) => {
          console.error('Failed to load expert', err);
          // parse possible backend error structure
          this.serverError = err?.error?.message || 'Failed to load expert';
        },
      });
  }

  private clearErrors() {
    this.serverError = null;
    this.fieldErrors = {};
    this.successMessage = null;
  }

  save() {
    this.clearErrors();

    if (this.form.invalid || !this.expertId) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      user: {
        email: this.form.value.email,
        // no password here unless you add a password field
      },
      expert: {
        name: this.form.value.name,
        phoneNo: this.form.value.phoneNo,
        address: this.form.value.address,
        notes: this.form.value.notes,
      },
    };

    this.submitting = true;

    this.http
      .patch(`${this.API}/${this.expertId}`, payload)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: (res) => {
          this.successMessage = 'Expert updated successfully';
          // short delay so user sees success, then navigate back
          setTimeout(() => this.router.navigate(['/expert']), 700);
        },
        error: (err) => {
          console.error('Update failed', err);

          // Typical NestJS validation error shape may be:
          // { message: [{ property: 'user.password', constraints: { minLength: '...' } }, ...], ... }
          // or { statusCode: 400, message: '...', error: 'Bad Request' }
          const body = err?.error;

          // 1) If body.message is an array of validation items, map them
          if (Array.isArray(body?.message)) {
            // try to map to fieldErrors (simple heuristic)
            for (const item of body.message) {
              // if item has property & constraints (ValidationPipe)
              if (item?.property && item?.constraints) {
                // join constraint messages
                this.fieldErrors[item.property] = Object.values(
                  item.constraints
                ).join(', ');
              } else if (typeof item === 'string') {
                // sometimes message array contains strings like "user.password must be longer..."
                // attempt to split by space for property hint
                const m = item.match(/^(.*?)\s/);
                if (m) {
                  const key = m[1].replace(/\./g, '.'); // keep dot notation
                  this.fieldErrors[key] = item;
                } else {
                  // fallback
                  this.serverError =
                    (this.serverError ? this.serverError + '; ' : '') + item;
                }
              }
            }
          } else if (typeof body?.message === 'string') {
            this.serverError = body.message;
          } else if (body?.error) {
            this.serverError = body.error;
          } else {
            this.serverError = 'Update failed';
          }
        },
      });
  }

  cancel() {
    this.router.navigate(['/expert']);
  }
}
