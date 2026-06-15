# Sprint 3: Directives, Pipes & Forms (@angular/core, @angular/forms) — 2026-06-15

- **What was done:**
  - Updated styles for input components for consistent UI
  - Updated `isAuth` signal in Auth Service
  - Enhanced postal code directive to support nested forms and improve reusability

- **Problems:**
  - Using different input styling across components
  - `isAuth` signal was previously based on customer data from Customer Service → caused incorrect redirect to sign-in page after
    refresh (customer was not yet loaded from server at page initialization)
  - Postal code directive worked only with flat forms → failed on pages with nested FormGroup structures (e.g. Registration page)

- **Solutions:**
  - Unified input styling across the application
  - Refactored authentication state: switched from “customer-based auth state” → to token-based reactive signal
  - Refactored postal code directive:
    - now works inside nested `formGroupName`
    - added runtime check (`instanceof FormGroup`) for safety

- **What I learned:**
  - Authentication state should be derived from a single source of truth (token signal), not asynchronously loaded user data
  - How to properly design Angular signals so they remain reactive and predictable across page refresh
  - How to design directives that are independent of form structure and reusable across different form layouts

- **Plans:**
  - Create About page

- **Time spent:**
  ~3 hours
