import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../auth/services/auth.service';
import { BooksService } from '../books-service/books-service';
import { TokenService } from '../../auth/services/token-service';


@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private booksService = inject(BooksService);

  async load(): Promise<void> {
    await firstValueFrom(this.tokenService.getAccessToken());
    await firstValueFrom(this.authService.initAuthFlow());
    // await firstValueFrom(this.booksService.getBooks());
    await firstValueFrom(this.booksService.initStore());

  }
}
