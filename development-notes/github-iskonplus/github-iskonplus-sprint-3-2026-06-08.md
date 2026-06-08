# Sprint 3: Checkpoint

## Part 1
- **What was done:** Added a Clear Cart feature to the bookstore application. Implemented a button that removes all items from the cart with a single action. Used `@ViewChildren` to access all cart item components from the parent component and trigger the cart removal logic for each item. Also ensured that the cart total is updated correctly after clearing the cart.
- **Main challenge:** Finding an efficient way to trigger actions on multiple child components from the parent component while keeping the existing cart logic reusable.
- **Solution:** Used Angular's `@ViewChildren` decorator to collect all cart item component instances and iterate through them when the Clear Cart button is clicked.
- **What I practiced:** Practiced Angular component interaction with `@ViewChildren`, `QueryList`, parent-child communication, state updates, cart management logic, and TypeScript typing
- **Time spent:** 1 hour
- **AI usage:** Used AI for learning purposes and understanding Angular concepts.
