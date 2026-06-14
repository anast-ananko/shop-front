import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  imports: [MatButtonModule, RouterLink, MatIcon],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {}
