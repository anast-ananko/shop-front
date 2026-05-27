import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { BooksService } from '../books-service/books-service';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {
  private authService = inject(AuthService);
  private booksService = inject(BooksService);

  async load(): Promise<void> {
    await firstValueFrom(this.authService.getAccessToken());
    await firstValueFrom(this.booksService.getBooks());

    this.authService.initAuthFlow();
  }
}
