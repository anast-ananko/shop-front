import { Routes } from "@angular/router";
import { authRequiredGuard } from "../core/auth/guards/auth-required-guard";
export const cartRoutes: Routes = [
  {
    path: 'cart',
    loadComponent: async () => {
      const m = await import("../pages/cart/cart");
      return m.Cart;
    },
     canActivate: [authRequiredGuard],
  }]
