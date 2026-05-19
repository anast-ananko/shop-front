import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './core/header/header';
import { Footer } from './core/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('shop-front');

  isAuth = signal(false);
  cartCount = signal(3);

  handleLogout() {
    this.isAuth.set(false);
  }
}
