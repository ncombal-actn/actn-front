import { Directive,HostListener } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appStopPropagation]'
})
export class StopPropagationDirective {

  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    event.stopPropagation();
    event.preventDefault();
  }

}
