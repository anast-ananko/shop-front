# Sprint 4: Checkpoint

## Part 1

- **What was done:** Implemented cart initialization during application startup. Added support for restoring a cart using the saved cart ID from localStorage, retrieving an existing cart by ID, loading the active cart as a fallback, and automatically creating a new cart when no existing cart is available.
- **Main challenge:** The application always created a new cart instead of restoring an existing one, and it was necessary to handle cases where the saved cart no longer existed.
- **Solution:** Added initCart() and getCartById() methods, implemented a fallback chain to restore the saved cart, request the active cart if needed, and create a new cart only as the final fallback.
- **What I practiced:** Practiced Angular services, RxJS (catchError, map), application initialization, error handling, working with the Composable Commerce Cart API, and cart state management.
- **Time spent:** 6.5 hours
- **AI usage:** Used AI to better understand the overall shopping cart workflow in Composable Commerce, including guest and authenticated user cart behavior, cart lifecycle, cart restoration strategies, and best practices for initializing and managing carts during application startup.
