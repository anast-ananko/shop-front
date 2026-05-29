# Sprint 2: Routing & Signals (@angular/router, @angular/core)

## Part 6
- **What was done:** Implemented login page functionality for the bookstore application. Added form submission logic, customer authentication through the commercetools API, access token retrieval, navigation after successful login, and server-side error handling. Implemented automatic error reset when form values change. Also improved application layout by setting the minimum page height to 100vh.
- **Main challenge:** Handling authentication requests, displaying server-side validation errors correctly, and improving user experience during the sign-in process.
- **Solution:** Connected the login form to the authentication service, handled successful and failed authentication responses, and subscribed to form value changes to clear outdated error messages automatically.
- **What I practiced:** Practiced Angular Reactive Forms, HTTP requests, authentication flows, RxJS subscriptions, Angular Router navigation, signals, and takeUntilDestroyed.
- **Time spent:** 3 hours
- **AI usage:** No AI tools were used.

---

## Part 7
- **What was done:** Implemented a guest guard to restrict authenticated users from accessing authentication pages such as the sign-in page.
- **Main challenge:** Correctly configuring route protection and redirect behavior for authenticated users.
- **Solution:** Created a dedicated guest guard that checks the authentication state and redirects authenticated users to the home page.
- **What I practiced:** Practiced Angular route guards, dependency injection with inject(), Router navigation, and route protection patterns.
- **Time spent:** 20 minutes
- **AI usage:** No AI tools were used.
