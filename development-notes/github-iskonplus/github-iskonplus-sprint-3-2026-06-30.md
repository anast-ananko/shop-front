# Sprint 3: Checkpoint

## Part 10

- **What was done:** Fixed the application initialization flow to ensure authentication is completed before loading books. Refactored authentication state management by replacing invalid `localStorage`-based computed properties with Angular Signals. Updated the authentication flow to provide a reactive auth state across the application.
- **Main challenge:** The application attempted to load protected resources before the authentication flow had completed, and the authentication state did not update because `computed` values depended directly on `localStorage`.
- **Solution:** Reorganized the initialization sequence so authentication completes before fetching books. Introduced Signals as the single source of truth for the authentication state and removed the dependency on `localStorage` inside `computed` properties.
- **What I practiced:** Practiced Angular application initialization (`APP_INITIALIZER`), Signals, reactive state management, dependency injection, and authentication flow design.
- **Time spent:** 4.5 hours
- **AI usage:** Not used.
