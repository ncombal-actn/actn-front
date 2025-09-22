import {
  Directive,
  Input,
  ElementRef,
  Renderer2,
  HostListener,
  OnDestroy
} from '@angular/core';
import { max, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

/**
 * Directive permettant d'exposer un setter pour l'attribut 'min-height' de l'hôte.
 */
@Directive({
  selector: '[appExposeHeightSetter]'
})
export class ExposeHeightSetterDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  setHeight(height: string) {
    this.renderer.setStyle(this.el.nativeElement, 'min-height', height);
  }

}
