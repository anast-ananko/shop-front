# Sprint 3: Checkpoint

## Part 2
- **What was done:** Added a badge to the cart icon in the header to display the current number of items in the shopping cart. The badge updates automatically when items are added or removed. Also moved the cart books filtering logic from the component to `BooksService` to centralize cart-related state management.
- **Main challenge:** Keeping the badge value synchronized with the cart state across the application while maintaining a clean separation of responsibilities.
- **Solution:** Used the existing cart state and reactive updates to ensure the badge always reflects the current number of items in the cart. Refactored the filtering logic into `BooksService` to make it reusable and easier to maintain.
- **What I practiced:** Practiced Angular state management, signals, reactive UI updates, Angular Material Badge, service-based architecture, and component integration.
- **Time spent:** 45 minutes
- **AI usage:** No AI tools were used.
