import { Component } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';

import { TEAM_MEMBERS } from '../../constants/team-data';

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo: string;
  github: string;
}

@Component({
  selector: 'app-about-us',
  imports: [MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions],
  templateUrl: './about-us.html',
  styleUrl: './about-us.scss',
})
export class AboutUs {
  members: TeamMember[] = TEAM_MEMBERS;
}
