import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { AuthenticationService, CartService, CatalogueMenuService, WindowService, LicenceService, SvgService } from '@core/_services';
import { Subject, fromEvent } from 'rxjs';
import { ExposeHeightSetterDirective } from '@/_util/directives/expose-height-setter.directive';
import { CatalogueSearchBarComponent } from '@/_util/components/catalogue-search-bar/catalogue-search-bar.component';
import {  takeUntil } from 'rxjs/operators';
import { environment } from '@env';
import { Router, RouterModule } from '@angular/router';
import {
  faArrowLeft,
  faCalendar,
  faCalendarAlt,
  faChevronRight,
  faCogs,
  faStar
} from "@fortawesome/free-solid-svg-icons";
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { KeyboardFocusDirective } from '@/_util/directives/keyboard-focus.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
    selector: 'app-rolling-header',
    templateUrl: './rolling-header.component.html',
    standalone: true,
    imports: [FontAwesomeModule,CommonModule,KeyboardFocusDirective,RouterModule,CatalogueSearchBarComponent,MatIconModule,MatButtonModule,MatAutocompleteModule],
    styleUrls: ['./rolling-header.component.scss'],
})
export class RollingHeaderComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('megamenu', { read: ExposeHeightSetterDirective }) exposeHeightSetter: ExposeHeightSetterDirective;
    @ViewChild(CatalogueSearchBarComponent) searchBar: CatalogueSearchBarComponent;

    environment = environment;
    showHeader = false;

    private _destroy$: Subject<void> = new Subject<void>();
    constructor(
        public router: Router,
        public authService: AuthenticationService,
        public cartService: CartService,
        private window: WindowService,
        public licenceService: LicenceService,
        public cms: CatalogueMenuService,
        private ngZone: NgZone,
        public svg: SvgService,
        @Inject(PLATFORM_ID)private platformId: Object
    ) { 

    }

    ngOnInit(): void {
        this.cms.catalogue$
        .subscribe(([subCategoriesLocked, currentSubCategoriesContainer]) => {
            this.exposeHeightSetter.setHeight(
                currentSubCategoriesContainer.offsetHeight + 'px'
            );
        });
        
        }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    ngAfterViewInit(): void {
        
        if(isPlatformBrowser(this.platformId)) {
            this.showHeader = window.pageYOffset > 120;
            this.ngZone.runOutsideAngular(() => {
                fromEvent(window.document, 'scroll')
                    .pipe(
                        takeUntil(this._destroy$))
                    .subscribe(e => {
                        if (!this.showHeader && window.pageYOffset > 120) {
                            this.ngZone.run(() => this.showHeader = true);
                        } else if (this.showHeader && window.pageYOffset <= 120) {
                            this.ngZone.run(() => this.showHeader = false);
                        }
                    });
            });
        }
    }

  protected readonly faChevronRight = faChevronRight;
  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faCogs = faCogs;
  protected readonly faCalendarAlt = faCalendarAlt;
  protected readonly faCalendar = faCalendar;
  protected readonly faStar = faStar;
}
