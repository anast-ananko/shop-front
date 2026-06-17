import { countries } from 'countries-list';

export interface CountryOption {
  code: string;
  name: string;
}

export const COUNTRIES_DATA: CountryOption[] = Object.entries(countries)
  .map(([code, data]) => ({
    code,
    name: data.name,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));
