import { Routes } from "@angular/router";

export const notFoundRoutes: Routes = [
  {
    path: '404',
    loadComponent: async () => {
      const m = await import("../pages/not-found/not-found");
      return m.NotFound;
    },
  },
];
