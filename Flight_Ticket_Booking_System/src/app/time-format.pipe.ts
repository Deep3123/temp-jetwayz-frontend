import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: false
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    // Expecting format like "5:00 AM" or "1:45 PM"
    const match = value.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);

    if (!match) return value; // fallback

    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const meridian = match[3].toUpperCase();

    if (meridian === 'PM' && hours !== 12) {
      hours += 12;
    } else if (meridian === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }
}