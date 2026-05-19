import { Routes } from '@angular/router';
import { Home } from '../pages/home/home';
import { notFoundRoutes } from './not-found.routes';
import { aboutUsRoutes } from './about-us.routes';
import { authRoutes } from './auth.routes';
import { cartRoutes } from './cart.routes';
import { catalogRoutes } from './catalog.routes';
import { searchRoutes } from './search.routes';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Home },
  ...searchRoutes,
  ...authRoutes,
  ...catalogRoutes,
  ...aboutUsRoutes,
  ...cartRoutes,
  ...notFoundRoutes,
  { path: '**', redirectTo: '404' },
];
