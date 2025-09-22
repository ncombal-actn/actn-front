import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ouiNonAdmin'
})
export class OuiNonAdminPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'A':
        return 'ADMIN';
      case 'O':
        return 'OUI';
      case 'N':
        return 'NON';
      default:
        return value;
    }
  }
}
