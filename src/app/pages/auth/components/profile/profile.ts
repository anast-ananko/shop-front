import { Component, inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-profile',
  imports: [MatCard, MatIcon],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  authService = inject(AuthService);

}
