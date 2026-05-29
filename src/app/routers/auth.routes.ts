import { Routes } from '@angular/router';

import { Auth } from '../pages/auth/auth';
import { authRequiredGuard } from '../core/auth/guards/auth-required-guard';
import { guestGuard } from '../core/auth/guards/guest-guard';

export const authRoutes: Routes = [
  {
    path: 'auth',
    component: Auth,
    children: [
      {
        path: 'registration',
        loadComponent: async () => {
          const m = await import('../pages/auth/components/registration/registration');
          return m.Registration;
        },
      },
      {
        path: 'sign-in',
        loadComponent: async () => {
          const m = await import('../pages/auth/components/sign-in/sign-in');
          return m.SignIn;
        },
        canActivate: [guestGuard],
      },
      {
        path: 'profile',
        loadComponent: async () => {
          const m = await import('../pages/auth/components/profile/profile');
          return m.Profile;
        },
        canActivate: [authRequiredGuard],
      },
    ],
  },
];
