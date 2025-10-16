import {Component, AfterViewInit, NgZone, OnDestroy, PLATFORM_ID, Inject} from '@angular/core';
import {fromEvent, Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {WindowService} from '@core/_services';
import {faChevronUp} from "@fortawesome/free-solid-svg-icons";
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-back-to-top',
  templateUrl: './back-to-top.component.html',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  styleUrls: ['./back-to-top.component.scss']
})
export class BackToTopComponent implements OnDestroy, AfterViewInit {

  timeToTop = 600;
  toStop = false;
  windowScrolled = false;

  private _destroy$ = new Subject<void>();

  constructor(
    private windowService: WindowService,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        fromEvent(this.windowService.nativeWindow.document, 'scroll')
          .pipe(
            debounceTime(20),
            takeUntil(this._destroy$))
          .subscribe(e => {
            if (!this.windowScrolled && this.windowService.pageYOffset > 100) {
              this.ngZone.run(() => this.windowScrolled = true);
            } else if (this.windowScrolled && this.windowService.pageYOffset < 10) {
              this.ngZone.run(() => this.windowScrolled = false);
            }
          });
      });
    }
  }

  scrollToTop() {
    const start = Date.now();
    const animation = setInterval(() => {
      const timePassed = Date.now() - start;
      if (timePassed >= this.timeToTop) {
        this.windowService.nativeWindow.scrollTo(0, 0);
        clearInterval(animation);
      } else {
        const currentScroll = window.scrollY;
        this.windowService.nativeWindow.scrollTo(0, currentScroll - (currentScroll * (timePassed / this.timeToTop)));
      }
    }, 16.6);
  }

  protected readonly faChevronUp = faChevronUp;
}
