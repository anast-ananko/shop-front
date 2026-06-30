# Sprint 3: Checkpoint

## Part 10

- **What was done:** Fixed the application initialization flow to ensure authentication is completed before loading books. Refactored authentication state management by replacing invalid `localStorage`-based computed properties with Angular Signals. Updated the authentication flow to provide a reactive auth state across the application.
- **Main challenge:** The application attempted to load protected resources before the authentication flow had completed, and the authentication state did not update because `computed` values depended directly on `localStorage`.
- **Solution:** Reorganized the initialization sequence so authentication completes before fetching books. Introduced Signals as the single source of truth for the authentication state and removed the dependency on `localStorage` inside `computed` properties.
- **What I practiced:** Practiced Angular application initialization (`APP_INITIALIZER`), Signals, reactive state management, dependency injection, and authentication flow design.
- **Time spent:** 4.5 hours
- **AI usage:** Not used.


## Part 11

- **What was done:** Improved the authentication routing flow by adding a dedicated authentication entry page. Implemented role-based navigation so authenticated users are redirected to the Main page, while guests are presented with authentication options.
- **Main challenge:** It was discovered that users could manually navigate to the `/auth` route, which previously displayed an empty page because only the `/auth/login` and `/auth/registration` routes existed.
- **Solution:** Introduced a dedicated parent authentication route that serves as an entry point for guests, displays navigation to Login and Registration, and redirects authenticated users to their Main page. Updated the nested routing structure to provide a consistent navigation experience.
- **What I practiced:** Practiced Angular Router configuration, nested routes, route guards, conditional rendering, and authentication flow design.
- **Time spent:** 1,5 hours
- **AI usage:** Not used.
