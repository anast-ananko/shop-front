import {Routes} from "@angular/router";

export const catalogRoutes: Routes = [{
  path: 'catalog',
  loadComponent: async () => {
    const m = await import("../pages/catalog/catalog");
    return m.Catalog;
  },
}]
