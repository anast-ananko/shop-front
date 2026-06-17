# Sprint 3: Directives, Pipes & Forms (@angular/core, @angular/forms) — 2026-06-16

- **What was done:**
  - Added About us page
  - Added custom Format Date pipe with configurable output formats
  - Replaced countries service with custom provider (using `useValue` + `InjectionToken`)

- **Problems:**
  - There was no readable format for date display in UI
  - Used a service (countries service) for static value (array of countries), which was unnecessary abstraction

- **Solutions:**
  - Created a reusable custom pipe for date formatting with parameters to support different display formats
  - Replaced Countries service with a clean dependency injection approach using `InjectionToken` and `useValue` provider
  - Moved static transformation logic out of service into a dedicated data/provider layer

- **What I learned:**
  - How to create custom pipes with parameters for flexible formatting
  - How dependency injection tokens work and how to provide static values using `useValue`
  - How to separate static data from services and keep DI layer clean

- **Plans:**
  - Add sorting for catalog and categories

- **Time spent:**
  ~6 hours
