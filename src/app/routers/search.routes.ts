import {Routes} from "@angular/router";
export const searchRoutes: Routes = [{
  path: 'search',
  loadComponent: async () => {
    const m = await import("../pages/search/search");
    return m.Search;
  },
}]
