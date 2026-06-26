# Sprint 4: HTTP, RxJS & Testing (@angular/common/http, rxjs, @angular/core/testing)

- **What was done:**
  - Implemented HTTP error interceptor using functional approach (HttpInterceptorFn)
  - Added comprehensive error handling for all HTTP status codes (400, 401, 403, 404, 500+)
  - Integrated NotificationService for user-friendly error messages
  - Implemented validation error extraction from various server response formats
  - Added client-side vs server-side error detection (ErrorEvent check)
  - Configured automatic redirects for 401 (to login) and 403 (to forbidden page)

- **Problems:**
  - Need to handle different error response formats from the backend (nested errors, arrays, objects)
  - Challenge of balancing user-friendly messages with technical debugging info
  - Decision on which endpoints to skip (auth endpoints to prevent infinite loops)

- **Solutions:**
  - Created flexible `extractValidationErrors()` function supporting multiple error formats
  - Separated error formatting logic into dedicated functions (`getUserFriendlyMessage`, `extractValidationErrors`)
  - Added console logging with detailed error info (status, URL, timestamp) for developers
  - Skipped OAuth endpoints to prevent interference with authentication flow
  - Returned throwError(() => error) to allow components to handle errors additionally if needed

- **What I learned:**
  - Difference between client-side errors (ErrorEvent) and server-side errors (HttpErrorResponse)
  - How to properly extract validation messages from various API response structures
  - Why it's critical to skip auth endpoints in error interceptors (prevents infinite loops)
  - Best practices for user-friendly error messages vs technical details

- **Plans:**
  - Add tests

- **Time spent:**
  ~8 hours
