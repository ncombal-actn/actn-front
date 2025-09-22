import { AfterViewInit, Component, ElementRef,  Renderer2} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-obj-display',
    templateUrl: './obj-display.component.html',
    styleUrls: ['./obj-display.component.scss']
})
export class ObjDisplayComponent implements AfterViewInit {

    // URL of the document to display
    displayUrl = '';

    constructor(
        private route: ActivatedRoute,
        private renderer: Renderer2,
        private el: ElementRef
    ) { }

    ngAfterViewInit() {
      /// !!!!!!!!!PAS D'URL ENTIERE!!!!!!!!! \\\
      this.route.queryParams.pipe(take(1)).subscribe((params) => {
        this.displayUrl = params.url;

        setTimeout(() => {
          const obj = this.el.nativeElement.querySelector('#obj');
          
          
          if (obj) {
            this.renderer.setAttribute(obj, 'data', this.displayUrl);
          }
        }, 0);

      });
    }

    

}
