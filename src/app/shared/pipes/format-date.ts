import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

type DateFormat = 'short' | 'long' | 'full';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  private locale = inject(LOCALE_ID);

  transform(value: string | Date, format: DateFormat = 'long'): string {
    if (!value) return '';

    const date = new Date(value);

    const optionsMap: Record<DateFormat, Intl.DateTimeFormatOptions> = {
      short: {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      },
      full: {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      },
    };

    return new Intl.DateTimeFormat(this.locale, optionsMap[format]).format(date);
  }
}
