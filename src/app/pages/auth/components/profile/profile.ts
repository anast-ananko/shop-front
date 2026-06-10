import { Component } from '@angular/core';
import { Settings } from './settings/settings';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-profile',
  imports: [Settings, MatTabsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {}
