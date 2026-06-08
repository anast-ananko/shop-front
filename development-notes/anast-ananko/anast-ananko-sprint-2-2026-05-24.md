# Sprint 2: Routing & Signals (@angular/router, @angular/core) — 2025-05-24

- **What was done:**
  - Implemented a registration form with the following fields: email, password, first name, last name, date of birth, and address (street name, street number, city, postal code, country)
  - Added client-side validation of all fields
  - Implemented custom postal code validation
  - Integrated the form with commercetools for customer registration
  - Added automatic login and redirect to the main page after registration
  - Implemented address management (ability to set a default address during registration, choose separate shipping and billing addresses, or use a single address for both)
  - Added a link to navigate to the login page

- **Problems:**
  - It was challenging to determine the correct sequence of steps for implementing registration followed by login using OAuth2
  - There were difficulties with the customer update logic, as it required sending an array of actions (action name + payload). A reusable solution was needed, along with a way to maintain customer version consistency. Requests had to be sent sequentially, which was tricky for me to implement in Angular
  - Finding a lightweight solution for custom postal code validation (validating multiple fields together) was also challenging

- **Solutions:**
  - Implemented logic to request an anonymous token at application startup using AppInitializerService (first retrieving an application token, then an anonymous token if needed)
  - Added automatic login after registration using the `customers/token` endpoint
  - Created `CustomerActions.ts` to centralize all customer-related actions and simplify API requests
  - Ensured that the customer signal state in AuthService is updated after each change to always keep the latest version
  - Used `switchMap` to guarantee the correct order of requests
  - Considered using lightweight npm packages for country and postal code data

- **What I learned:**
  - How OAuth2 works in practice
  - How to use `switchMap` to handle sequential requests and `destroyRef` to prevent memory leaks
  - How to work with HTTP requests and maintain signal state
  - How to build forms with validation and handle submission

- **Plans:**
  - Implement a guard that redirects unauthenticated users to the login page
  - Implement filtering, sorting, and searching on the catalog page

- **Time spent:**
  16 hours
