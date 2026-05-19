import { Routes } from "@angular/router";
export const cartRoutes: Routes = [
  {
    path: 'cart',
    loadComponent: async () => {
      const m = await import("../pages/cart/cart");
      return m.Cart;
    },
  }]
