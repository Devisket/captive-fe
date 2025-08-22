import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateTransform',
  standalone: true
})
export class DateTransformPipe implements PipeTransform {
  private datePipe = new DatePipe('en-US');

  transform(value: string | Date | null, format: string = 'mediumDate'): string | null {
    if (!value) {
      return null;
    }

    if (typeof value === 'string') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return null;
      }
      return this.datePipe.transform(date, format);
    }

    return this.datePipe.transform(value, format);
  }
}