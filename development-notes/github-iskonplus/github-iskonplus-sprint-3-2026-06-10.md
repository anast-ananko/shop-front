# Sprint 3: Checkpoint

## Part 3

- **What was done:** Added tab navigation to the Profile page and split it into three sections: Favorites, User Info, and Settings. Implemented the Favorites tab and extracted shared book catalog rendering and pagination logic into a reusable `PaginatedBooksCatalogComponent`.
- **Main challenge:** Avoiding code duplication between the Favorites page and other catalog-based pages while keeping the component flexible and reusable.
- **Solution:** Moved the common book rendering and pagination functionality into a dedicated component and passed the required book collection through inputs.
- **What I practiced:** Practiced Angular component composition, reusable component design, input bindings, Angular Material Tabs, code refactoring, and UI organization.
- **Time spent:** 2 hours
- **AI usage:** Used AI for learning purposes and discussing implementation approaches.
