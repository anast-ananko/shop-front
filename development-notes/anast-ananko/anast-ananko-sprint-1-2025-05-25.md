# Sprint 2: Routing & Signals (@angular/router, @angular/core) — 2025-05-25

- **What was done:**
  - Implemented `authRequiredGuard` to protect restricted routes (e.g., Profile page)
  - Used Angular `CanActivateFn` functional guard approach
  - Integrated guard with `AuthService` using signal-based auth state (`customer`)
  - Added redirect logic for unauthenticated users to `/auth/sign-in` using `UrlTree`

- **Problems:**
  - Initially used `router.navigate()` inside the guard, which caused side effects and was not aligned with Angular best practices
  - Confusion about how to handle redirects in guards (router.navigate vs UrlTree)

- **Solutions:**
  - Replaced `router.navigate()` with `router.createUrlTree()` to handle redirects correctly in the guard
  - Clarified that guards should return navigation result instead of triggering navigation
  - Used `computed` signal (`isAuth`) from `AuthService` as a single source of truth

- **What I learned:**
  - `UrlTree` is the correct way to handle redirects in guards
  - Signals can be effectively used as reactive auth state

- **Plans:**
  - Implement filtering, sorting, and searching on the catalog page

- **Time spent:**
  1 hour
