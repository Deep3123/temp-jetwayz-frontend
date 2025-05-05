import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "formatDuration",
  standalone: false,
})
export class FormatDurationPipe implements PipeTransform {
  transform(durationMinutes: number): string {
    if (!durationMinutes || isNaN(durationMinutes)) {
      return "";
    }

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return `${hours} hrs ${minutes} mins`;
  }
}
