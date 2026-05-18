# Sprint 1: Project Setup & Component Basics (@angular/core) — 2025-05-18

- **What was done:**
  Created a new Angular project using CLI. Set up project structure and initial architecture. Configured Prettier and ESLint for consistent code style across the team. Installed Angular Material into the project using Angular CLI. Built the base layout components: Header and Footer.

- **Problems:**
  There was uncertainty about how to manage state between components using Angular Signals, especially when deciding whether to keep state locally in components or move it to a shared service.

- **Solutions:**
  Decided to use Angular Signals for state management in the App component instead of service at the moment.

- **What I learned:**
  Learned how to initialize an Angular project properly using Angular CLI. Understood how Prettier and ESLint prevent code conflicts and reduce review time. Got practice creating reusable layout components like Header and Footer. Also learned the basics of Angular Signals, including how signal() works for reactive state management. Additionally, learned about property binding using [prop] for passing data into components, and event binding using (event) for handling user interactions (click event).

- **Plans:**
  In Sprint 2, start implementing application features with routing, lazy loading and state management using signals. Begin creating pages. If time allows, implement authentication and authorization features, including route guards to protect restricted routes.

- **Time spent:**
  5–6 hours
