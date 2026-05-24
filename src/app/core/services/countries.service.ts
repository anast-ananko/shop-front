import { computed, Injectable, signal } from '@angular/core';
import { countries } from 'countries-list';

export interface CountryOption {
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private allCountries = signal<CountryOption[]>(
    Object.entries(countries).map(([code, data]) => ({
      code,
      name: data.name,
    }))
  );

  countries = computed(() =>
    this.allCountries().sort((a, b) => a.name.localeCompare(b.name))
  );
}
