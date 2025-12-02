// edit-partner.ts
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
  selector: 'app-edit-partner',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-partner.html',
  styleUrls: ['./edit-partner.scss'],
})
export class EditPartner {
  form: FormGroup;
  loading = false; 
  submitting = false; 
  serverError: string | null = null; 
  fieldErrors: Record<string, string> = {}; 
  successMessage: string | null = null;
  partnerId?: number;
  private readonly API = 'http://localhost:3000/partners'; 

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
        console.warn('Invalid partner id:', idParam);
        this.router.navigate(['/partner']);
        return;
      }
      this.partnerId = id;
      this.loadPartner();
    });
  }

  loadPartner() {
    if (!this.partnerId) return;
    this.loading = true;
    this.serverError = null;
    this.fieldErrors = {};

    this.http
      .get<any>(`${this.API}/${this.partnerId}`)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          if (!res) {
            this.serverError = 'Partner not found';
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
          console.error('Failed to load partner', err);
          this.serverError = err?.error?.message || 'Failed to load partner';
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

    if (this.form.invalid || !this.partnerId) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      user: {
        email: this.form.value.email,
      },
      partner: {
        name: this.form.value.name,
        phoneNo: this.form.value.phoneNo,
        address: this.form.value.address,
        notes: this.form.value.notes,
      },
    };

    this.submitting = true;

    this.http
      .patch(`${this.API}/${this.partnerId}`, payload)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: (res) => {
          this.successMessage = 'Partner updated successfully';
          setTimeout(() => this.router.navigate(['/partner']), 700);
        },
        error: (err) => {
          console.error('Update failed', err);
          const body = err?.error;

          if (Array.isArray(body?.message)) {
            for (const item of body.message) {
              if (item?.property && item?.constraints) {
                this.fieldErrors[item.property] = Object.values(
                  item.constraints
                ).join(', ');
              } else if (typeof item === 'string') {
                const m = item.match(/^(.*?)\s/);
                if (m) {
                  const key = m[1].replace(/\./g, '.'); 
                  this.fieldErrors[key] = item;
                } else {
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
    this.router.navigate(['/partner']);
  }
}
