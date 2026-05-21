import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './core/header/header';
import { Footer } from './core/footer/footer';
import { AuthService } from './core/http/services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('shop-front');
  private authService = inject(AuthService);

  constructor() {
    this.authService.getAccessToken().subscribe();
  }

  isAuth = signal(false);
  cartCount = signal(3);

  handleLogout() {
    this.isAuth.set(false);
  }
}
