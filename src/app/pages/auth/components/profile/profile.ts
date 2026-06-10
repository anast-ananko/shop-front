import { Component } from '@angular/core';
import { Settings } from './settings/settings';
import {MatTabsModule} from '@angular/material/tabs';
import { Favorites } from './favorites/favorites';

@Component({
  selector: 'app-profile',
  imports: [Settings, MatTabsModule, Favorites],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {}
