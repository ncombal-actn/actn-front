import { Directive, HostListener, ElementRef, Renderer2, Input } from '@angular/core';
import { combineLatest } from 'rxjs';
import { Subject } from 'rxjs';
import {
  defaultIfEmpty,
  withLatestFrom,
  debounceTime
} from 'rxjs/operators';

/**
 * Toggle la classe 'focus' sur l'élément si l'élément est ou non dans l'état focused à la suite d'un évènement clavier.
 */
@Directive({
  selector: '[appKeyboardFocus]',
  standalone: true
})
export class KeyboardFocusDirective {

  @Input('keepFocusIf') keepFocus: boolean = false;

  tabup: Subject<boolean> = new Subject<boolean>();
  tabdown: Subject<void> = new Subject<void>();
  focusin: Subject<boolean> = new Subject<boolean>();
  focusout: Subject<void> = new Subject<void>();

  constructor(private element: ElementRef, private renderer: Renderer2) {
    combineLatest([this.focusout, this.tabup])
      .pipe(
        debounceTime(100),
        withLatestFrom(this.focusin.pipe(defaultIfEmpty(false)))
      )
      .subscribe(([[focusout, tabup], focusin]) => {
        if (!focusin && !tabup && !this.keepFocus) {
          this.renderer.removeClass(this.element.nativeElement, 'focus');
        }
      });
  }

  @HostListener('keyup.Tab')
  onTabFocus() {
    this.renderer.addClass(this.element.nativeElement, 'focus');
    this.tabup.next(true);
    this.focusin.next(false);
  }

  @HostListener('keyup.shift.Tab')
  onTabBackwardFocus() {
    this.renderer.addClass(this.element.nativeElement, 'focus');
    this.tabup.next(true);
    this.focusin.next(false);
  }

  @HostListener('keydown.Tab')
  onTabdown() {
    this.tabdown.next();
  }

  @HostListener('focusout')
  onFocusout() {
    this.focusout.next();
    this.tabup.next(false);
  }

  @HostListener('focusin')
  onFocusin() {
    this.focusin.next(true);
  }
}
