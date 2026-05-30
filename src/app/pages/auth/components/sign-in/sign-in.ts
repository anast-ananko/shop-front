import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';
import { CustomerService } from '../../../../core/services/customer/customer.service';

@Component({
  selector: 'app-sign-in',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private customerService = inject(CustomerService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  serverError = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/),
      ],
    ],
  });

  ngOnInit() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.serverError.set(null));
  }

  successLogin() {
    this.form.reset();
    this.router.navigateByUrl('/');
  }

  submit() {
    const signupPayload = this.form.getRawValue();

    this.authService
      .getCustomerToken(signupPayload)
      .pipe(
        switchMap(() => this.customerService.getMe()),
        tap((customer) => this.authService.customer.set(customer)),
        takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.successLogin(),
        error: (err) => {
          this.serverError.set(err.error.message || 'An error occurred during sign in.');
        },
      });
  }
}
