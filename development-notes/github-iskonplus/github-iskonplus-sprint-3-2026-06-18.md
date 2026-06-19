# Sprint 3: Checkpoint

## Part 7

- **What was done:** Added an HTTP interceptor for authorization handling and integrated it into the application flow. Moved token retrieval logic into a separate service to keep authorization logic centralized and reusable. Configured the interceptor to automatically attach authorization data to the required API requests and improved the structure of authentication-related code.
- **Main challenge:** The application communicates with multiple API endpoints that use different base URLs, so the main challenge was to make the interceptor apply authorization logic only to the correct requests without affecting unrelated API calls.
- **Solution:** Created a separate token service for working with access tokens, moved token-related logic out of components/services, and added request filtering inside the interceptor based on API URL rules. This made authorization handling cleaner, more reusable, and easier to maintain.
- **What I practiced:** Practiced Angular HTTP interceptors, token service separation, request filtering by base URL, authentication flow integration, service responsibility separation, and centralized authorization handling.
- **Time spent:** 3 hours
- **AI usage:** Used AI to discuss interceptor implementation, request filtering for multiple base URLs, and authorization flow integration.


## Part 8

- **What was done:** Restored proper validation for authenticated users and fixed the authorization check logic. Added a guard for the registration route to prevent authenticated users from accessing the registration page. Implemented automatic redirection to the homepage when an authenticated user attempts to open the registration route.
- **Main challenge:** Ensuring that authenticated users cannot access guest-only pages while maintaining a consistent authorization flow across the application.
- **Solution:** Fixed the authenticated user validation logic, implemented a registration route guard, and configured redirection from the registration page to the homepage for authenticated users.
- **What I practiced:** Practiced Angular route guards, authentication and authorization flow management, route redirection, and bug fixing.
- **Time spent:** 1 hour
- **AI usage:** AI tools were not used.
