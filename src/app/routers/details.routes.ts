import { Routes } from "@angular/router";
export const detailsRoutes: Routes = [
  {
    path: 'details/:id',
    loadComponent: async () => {
      const m = await import("../pages/details/details");
      return m.Details;
    },
  }]
