import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

@Directive({
  selector: '[appToggleClassOn]',
  standalone: true,
})
export class ToggleClassOnDirective implements AfterViewInit, OnDestroy {
  @Input('appToggleClassOn') events: string;
  @Input() toggleClass: string;

  hasClass = false;
  listenener: () => void;

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const classNames = this.toggleClass.split(' ').map(name => name.trim());

    for (const event of this.events.replace(/\s/g, '').split(',')) {
      this.listenener = this.renderer.listen(
        this.element.nativeElement,
        event,
        () => {
          if (this.hasClass) {
            for (const className of classNames) {
              this.renderer.removeClass(this.element.nativeElement, className);
            }
            this.hasClass = false;
          } else {
            for (const className of classNames) {
              this.renderer.addClass(this.element.nativeElement, className);
            }
            this.hasClass = true;
          }
        }
      );
    }
  }

  ngOnDestroy() {
    this.listenener();
  }
}
