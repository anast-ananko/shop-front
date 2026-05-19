import { Routes } from "@angular/router";

export const aboutUsRoutes: Routes = [
  {
    path: 'about-us',
    loadComponent: async () => {
      const m = await import("../pages/about-us/about-us");
      return m.AboutUs;
    },
  },
];
