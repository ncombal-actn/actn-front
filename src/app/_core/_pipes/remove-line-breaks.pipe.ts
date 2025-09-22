import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeLineBreaks'
})
export class RemoveLineBreaksPipe implements PipeTransform {

  transform(value: string): string {
    if (value) {
      return `● ${value}`;
    }
    return value;
  }

}
