# Sprint 2: Routing & Signals (@angular/router, @angular/core) — 2026-06-07

- **What was done:**
  - Implemented User Profile page with display of personal data (first name, last name, email, date of birth)
  - Integrated data loading from commercetools Customers API via `CustomerService`
  - Built editable fields with inline edit mode (edit / save / cancel per field)
  - Added password change functionality (current password, new password, confirmation)
  - Implemented custom validator for password confirmation (`passwordMatchValidator`)
  - Added full address management:
    - Display of user addresses (shipping / billing / default shipping / default billing)
    - Separation into default and other addresses
    - Add new address via Angular Material dialog
    - Edit and delete address actions
    - Set default shipping and billing addresses
  - Implemented reactive forms with validation (same rules as registration)
  - Added server error and success message handling with auto-clear via Angular Material snackBar or `setTimeout`
  - Used Angular Signals (`computed`, `signal`) for reactive state management

- **Problems:**
  - The need to send correct action types with properly structured data to commercetools when updating profile information
  - Synchronizing UI after API updates (e.g., password change → obtain new token → reload customer data)
  - Managing different types of addresses without duplication, including:
    - grouping them logically for better readability
    - enabling specific actions only for certain address types
    - adding logic to assign shipping and/or billing roles when creating a new address
  - Having duplicated and complex logic for postal code and country handling across this page and the registration page, and the need to extract it into a reusable solution

- **Solutions:**
  - Added additional customer action types in `CustomerActions.ts`
  - Introduced derived state using `computed` signals (e.g., `shippingAddresses`, `billingAddresses`, `defaultShippingAddress`, `defaultBillingAddress`)
  - Ensured that at least one address type (shipping or billing) is always selected when creating a new address
  - Used `switchMap` to chain dependent API calls (e.g., change password → get new token → fetch customer)
  - Created a custom directive to encapsulate logic related to country and postal code validation, using `ControlContainer` to access the parent form without passing it explicitly
  - Centralized error handling and added user feedback with automatic reset using `setTimeout`

- **What I learned:**
  - How to effectively use Signals and `computed` for derived state
  - That `switchMap` is essential for chaining dependent asynchronous operations
  - Angular Material dialogs are an effective pattern for complex forms such as address management
  - How to create custom directives and access the host form using `ControlContainer` without explicitly passing it as a parameter

- **Plans:**
  - Adapt the custom directive to work on the registration page, taking into account its nested form structure

- **Time spent:**
  ~25 hours
