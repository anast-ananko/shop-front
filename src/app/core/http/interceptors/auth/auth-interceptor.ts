import { inject } from '@angular/core';
import { TokenStorage } from '../../../auth/services/token.storage';
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/oauth/')) {
    return next(req);
  }
  const tokenStorage = inject(TokenStorage);
  const token = tokenStorage.getCurrentToken();

  if (token) {
    console.log('token', token);
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  return next(req);
};
