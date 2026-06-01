# Sprint 2: Routing & Signals (@angular/router, @angular/core)

## Part 8
- **What was done:** Implemented the Cart Page for the bookstore application. Added cart item quantity controls, stock quantity validation, and total price calculation based on selected quantities. Implemented communication between cart item components and the parent cart component to keep the total price updated. Fixed total recalculation when removing items from the cart. Also updated header styles and improved responsive behavior.
- **Main challenge:** Managing synchronization between individual cart item quantities and the overall cart total while keeping components independent and reusable.
- **Solution:** Implemented event-based communication between child and parent components using outputs. Stored and updated item totals in the parent component and recalculated the overall cart total whenever quantities changed or items were removed.
- **What I practiced:** Practiced Angular component communication, signals, outputs, computed values, state management, reactive UI updates, conditional rendering, and responsive styling.
- **Time spent:** 4 hours
- **AI usage:** No AI tools were used.
