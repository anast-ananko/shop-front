# Sprint 2: Routing & Signals (@angular/router, @angular/core)

## Part 5

- **What was done:** Implemented commercetools API integration for the bookstore application. Created a universal API service for reusable HTTP requests, configured OAuth authorization flow, implemented access token retrieval and storage, and added product fetching logic. Added mapping logic to transform commercetools product responses into the frontend Book model. Also improved application initialization flow and added automatic subscription cleanup using takeUntilDestroyed.
- **Main challenge:** Understanding commercetools authentication flow, handling dependent HTTP requests with RxJS operators, and correctly mapping deeply nested API response structures into a clean frontend model.
- **Solution:** Implemented token retrieval through OAuth API requests, reused stored access tokens, chained requests using switchMap, and separated API responsibilities into dedicated services. Added typed interfaces for commercetools responses and created reusable mapping functions for transforming raw product data into application models.
- **What I practiced:** Practiced Angular services architecture, RxJS operators (switchMap, map, tap), HTTP requests, token-based authentication, state management with signals, TypeScript typing, API response mapping, and automatic subscription cleanup with takeUntilDestroyed.
- **Time spent:** 5 hours
- **AI usage:** AI tools were used to help generate TypeScript interfaces related to the commercetools backend response structure, as well as to discuss application architecture and better understand how the commercetools API works.
