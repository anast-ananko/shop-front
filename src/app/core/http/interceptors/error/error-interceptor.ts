import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { NotificationService } from '../../../services/notification/notification';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  if (req.url.includes('/oauth/')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      handleError(error, notificationService, router);

      return throwError(() => error);
    }),
  );
};

function handleError(
  error: HttpErrorResponse,
  notificationService: NotificationService,
  router: Router,
): void {
  console.error('HTTP Error:', {
    status: error.status,
    message: error.message,
    url: error.url,
    timestamp: new Date().toISOString(),
  });

  const userMessage = getUserFriendlyMessage(error, router);

  notificationService.showError(userMessage);
}

function getUserFriendlyMessage(error: HttpErrorResponse, router: Router): string {
  if (error.error instanceof ErrorEvent) {
    return 'Network error. Please check your internet connection.';
  }

  switch (error.status) {
    case 400:
      return extractValidationErrors(error);

    case 401:
      router.navigate(['/auth/sign-in']);
      return 'Your session has expired. Please login again.';

    case 403:
      router.navigate(['/forbidden']);
      return "Access denied. You don't have permission to perform this action.";

    case 404:
      return 'Resource not found.';

    case 500:
    case 502:
    case 503:
      return 'Server error. Please try again later.';

    default:
      return error.error?.message || error.message || 'An unexpected error occurred.';
  }
}

function extractValidationErrors(error: HttpErrorResponse): string {
  const errorData = error.error;

  if (!errorData) {
    return 'Validation failed. Please check your input.';
  }

  if (errorData.errors && Array.isArray(errorData.errors)) {
    return errorData.errors.join('. ');
  }

  if (errorData.errors && typeof errorData.errors === 'object') {
    const messages = Object.values(errorData.errors).flat();
    return messages.join('. ');
  }

  if (errorData.message) {
    return errorData.message;
  }

  if (errorData.error && typeof errorData.error === 'string') {
    return errorData.error;
  }

  return 'Validation failed. Please check your input.';
}
