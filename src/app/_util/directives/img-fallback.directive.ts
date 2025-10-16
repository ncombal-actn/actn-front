import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'img [default]',
  standalone: true,
  host: {
    '(error)': 'updateUrl()',
    '[src]': 'src'
  }
})
export class ImgFallbackDirective {
  @Input() src: string;
  @Input() default: string;

  updateUrl() {
    this.src = this.default;
  }
}
