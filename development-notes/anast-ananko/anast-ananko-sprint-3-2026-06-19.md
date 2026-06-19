# Sprint 3: Directives, Pipes & Forms (@angular/core, @angular/forms) — 2026-06-19

- **What was done:**
  - Implemented categories feature with subcategories
  - Added server-side filtering of books by category using commercetools API
  - Integrated category selection with dynamic data fetching
  - Implemented client-side sorting (by price and name) using Angular signals and computed values

- **Problems:**
  - Commercetools filtering API was not working as expected (`filter`, `filter.query`, and search endpoint confusion)
  - Layout issues with category bar and subcategories (wrapping, alignment, animations)

- **Solutions:**
  - Switched to supported filtering approach using where=categories(id="...") for product-projections endpoint

- **What I learned:**
  - How commercetools filtering works (where vs filter.query vs search endpoint limitations)
  - How to combine server-side filtering with client-side sorting effectively
  - How to manage UI state cleanly using signals (loading, error, data)

- **Plans:**
  - Add more parameters for filtering

- **Time spent:**
  ~8 hours
