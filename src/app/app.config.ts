import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';

import { routes } from './routers/app.routes';
import { AppInitializerService } from './core/services/app-initializer/app-initializer.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/http/interceptors/auth/auth-interceptor';
import { COUNTRIES } from './shared/tokens/countries';
import { COUNTRIES_DATA } from './shared/data/countries';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withViewTransitions()),
    provideNativeDateAdapter(),
    provideAppInitializer(() => {
      const init = inject(AppInitializerService);
      return init.load();
    }),
    {
      provide: COUNTRIES,
      useValue: COUNTRIES_DATA,
    },
  ],
};
