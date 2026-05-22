import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../http/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {
  private authService = inject(AuthService);

  async load(): Promise<void> {
    await firstValueFrom(this.authService.getAccessToken());

    this.authService.initAuthFlow();
  }
}
