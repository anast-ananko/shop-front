import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, MatButtonModule, RouterLink],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Auth {
    private router = inject(Router);

  isAuthRootPage(): boolean {
    return this.router.url === '/auth';
  }
}
