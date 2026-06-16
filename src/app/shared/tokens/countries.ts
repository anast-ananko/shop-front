import { InjectionToken } from '@angular/core';

import { CountryOption } from '../data/countries';

export const COUNTRIES = new InjectionToken<CountryOption[]>('COUNTRIES');
