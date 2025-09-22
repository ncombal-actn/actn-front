import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import {Observable, Subject, BehaviorSubject, Subscription, of, combineLatest} from 'rxjs';
import { debounceTime, switchMap, filter, delay, withLatestFrom, takeUntil, tap, skip, take } from 'rxjs/operators';
import { Tree, Categorie } from '@/_util/models';
import { ExposeHeightSetterDirective } from '@/_util/directives/expose-height-setter.directive';
import { Router } from '@angular/router';
import { AuthenticationService, CartService, CatalogueService, ComponentsInteractionService, SvgService, UserService, WindowService } from '@core/_services';
import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { RmaService } from '@core/_services/rma.service';
import { LicenceService } from '@core/_services/licence.service';
import { CotationService } from '@core/_services/cotation.service';
import { ComparateurService } from '@/_core/_services/comparateur.service';
import { FavorisService } from '@/_core/_services/favoris.service';
import { faArrowLeft, faCalendarAlt, faChevronRight, faCogs, faPhone, faStar } from "@fortawesome/free-solid-svg-icons";
import { KeyboardFocusDirective } from '@/_util/directives/keyboard-focus.directive';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltip } from '@angular/material/tooltip';
import { UtilModule } from "@/_util/util.module";
import {Cacheable} from "ts-cacheable";
import { CatalogueSearchBarComponent } from '@/_util/components/catalogue-search-bar/catalogue-search-bar.component';
//import {NewCartService} from "@services/new-cart.service";

@Component({
  selector: 'app-header',
  imports: [KeyboardFocusDirective, CommonModule, FontAwesomeModule, MatTooltip, CatalogueSearchBarComponent, UtilModule],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('megamenu', { read: ExposeHeightSetterDirective }) exposeHeightSetter: ExposeHeightSetterDirective;

  environment = environment;
  destroy$ = new Subject<boolean>();
 // mouseEnterTimeout: number = null;

  onSubnavTriggerClickedOrTapped$ = new Subject<boolean>();
  showSubnav = false;
  isPopUp = false;

  _subNavSmall = new BehaviorSubject<boolean>(false);
  get subNavSmall() { return this._subNavSmall.value; }

  structureCatalogue: Observable<Tree<Categorie>>;
  showCatalogue = false;

  mouseEnterTimeout: any;
  mouseLeaveTimeout: any;


  showRessources = false;
  showActual = false;
  showPromotions = false;
  ListeRessources: string = null;

  promotionHoveredInt = -1;
  nosMarquesHoveredInt = -2;
  nosMetiersHoveredInt = -3;
  destockageHoveredInt = -4;

  onCatalogueCategorieHoveredIndex = new BehaviorSubject<number>(null);
  onCatalogueCategorieTappedIndex = new BehaviorSubject<number>(null);
  currentActiveCategorieIndex = new BehaviorSubject<number>(null);
  currentSubCategoriesContainer = new BehaviorSubject<HTMLElement>(null);

  onCatalogueSousCategoriesContainerHoveredIndex = new BehaviorSubject<number>(null);
  onCatalogueSousCategoriesContainerTappedIndex = new BehaviorSubject<number>(null);

  comparateurSubscription: Subscription = null;
  favorisSubscription: Subscription = null;

  comparateurReferences: string[] = [];
  favorisReferences: string[] = [];

  matToolTipShowDelayValue = 0;
  matToolTipHideDelayValue = 100;
  matToolTipPositionValue: 'left' | 'right' | 'above' | 'below' = 'below';
  nbrOfCriticalCotations:number;

  constructor(
    public authService: AuthenticationService,
    public cartService: CartService,
    private catalogueService: CatalogueService,
    public componentsInteractionService: ComponentsInteractionService,
    public router: Router,
    public breakpointObserver: BreakpointObserver,
    private http: HttpClient,
    private rmaService: RmaService,
    public licenceService: LicenceService,
    private window: WindowService,
    private comparateurService: ComparateurService,
    private favorisService: FavorisService,
    public svg: SvgService,
    public cotationService: CotationService,
    public userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.rmaService.popUp.subscribe(data => this.isPopUp = data === "Ok");
  }

  ngOnInit() {
    this.comparateurReferences = this.comparateurService.setUp();
    if (this.comparateurReferences[0] == "") this.comparateurReferences = [];
    this.favorisReferences = this.favorisService.setUp();
    if (this.favorisReferences[0] == "") this.favorisReferences = [];

    this.structureCatalogue = this.catalogueService.getStructure();

    //this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(() => this.getRequestRessources());

    this.breakpointObserver.observe(['(max-width: 767.98px)']).pipe(takeUntil(this.destroy$)).subscribe(state => {
      this._subNavSmall.next(state.matches);
      if (this.exposeHeightSetter && state.matches) this.exposeHeightSetter.setHeight('auto');
    });

    /*setTimeout(() => {
      if (this.authService.currentUser && this.authService.currentUser.name.length > 35) {
        window.document.getElementById('userName').style.fontSize = '0.9rem';
      }
    }, 2000);*/

    combineLatest(this.onCatalogueCategorieHoveredIndex, this.onCatalogueSousCategoriesContainerHoveredIndex)
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(100),
        switchMap(([hoveredCategorie, currentHoveredSubCategoriesContainer]) => {
          if (currentHoveredSubCategoriesContainer === null && !this.subNavSmall) {
            this.currentActiveCategorieIndex.next(hoveredCategorie);
            return of(false);
          } else {
            return of(true);
          }
        }),
        filter(subCategoriesLocked => !subCategoriesLocked),
        delay(50),
        withLatestFrom(this.currentSubCategoriesContainer.pipe(skip(1)))
      )
      .subscribe(([subCategoriesLocked, currentSubCategoriesContainer]) => {
        this.exposeHeightSetter.setHeight(currentSubCategoriesContainer.offsetHeight + 'px');
      });

    this.onCatalogueCategorieTappedIndex
      .pipe(
        takeUntil(this.destroy$),
        tap(categorieIndex => this.currentActiveCategorieIndex.next(this.currentActiveCategorieIndex.value === categorieIndex ? null : categorieIndex)),
        delay(50),
        withLatestFrom(this.currentSubCategoriesContainer.pipe(skip(1)))
      )
      .subscribe(([categorieIndex, currentSubCategoriesContainer]) => {
        if (!this.subNavSmall) {
          setTimeout(() => {
            this.exposeHeightSetter.setHeight(currentSubCategoriesContainer.offsetHeight + 'px');
          }, 20);
        }
      });

    this.comparateurSubscription = this.comparateurService.compare().subscribe(ret => this.comparateurReferences = ret);
    this.favorisSubscription = this.favorisService.favoris().subscribe(ret => this.favorisReferences = ret);
    if (isPlatformBrowser(this.platformId)) {
      const storedCotations = sessionStorage.getItem('cotationData');
      if (storedCotations) {
        const cotations = JSON.parse(storedCotations);
        this.nbrOfCriticalCotations = cotations.nbrOfCriticalCotations;
       
        
      }
    }
  }

  testFDP() {

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/panier']);
    } else {
      this.openSideNav('toggleEspaceClient');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    if (this.comparateurSubscription) this.comparateurSubscription.unsubscribe();
    if (this.favorisSubscription) this.favorisSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {}

  onSearch() {
    this.showSubnav = false;
    this.showCatalogue = false;
    this.showRessources = false;
    this.showActual = false;
    this.showPromotions = false;
    this.currentActiveCategorieIndex.next(null);
  }

  onCatalogueNiveauSelected(...niveaux: any[]) {
    this._subCategorieHasSubSubCategorie(niveaux);
    if (niveaux.length === 3) {
      this.structureCatalogue.pipe(take(1)).subscribe(categories => {
        const subcategories = categories.nodes.find(subcat => subcat.value.label == niveaux[1]);
        const subsubcategories = subcategories.nodes.find(subsubcat => subsubcat.value.label == niveaux[2]);
        if (subsubcategories.nodes && subsubcategories.nodes.length > 1) {
          this.router.navigate(['/catalogue/' + niveaux[1] + '/' + niveaux[2]]);
        } else {
          this.router.navigate(['/catalogue/' + niveaux[1] + '/' + niveaux[2] + '/unique']);
        }
        this.showSubnav = false;
        this.showCatalogue = false;
      });
    } else {
      this.router.navigate(niveaux);
      this.showSubnav = false;
      this.showCatalogue = false;
      this.currentActiveCategorieIndex.next(null);
    }
  }

  _subCategorieHasSubSubCategorie(niveaux): boolean {
    return true;
  }

  navigateCataloguePath(path) {
    this.router.navigate(['/catalogue/' + path]);
    this.showSubnav = false;
    this.showCatalogue = false;
    this.currentActiveCategorieIndex.next(null);
  }

  onBackButton() {
    this.currentActiveCategorieIndex.next(null);
  }

  openSideNav(selectedMenu: string) {
    this.componentsInteractionService.sideNavigationLine.fireOpenSideNav(selectedMenu);
  }


  getRequestRessources() {
    this.http.get<any>(`${environment.apiUrl}/ListeRessources.php`, { withCredentials: true, responseType: 'json' })
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.ListeRessources = data);
  }

  onMouseEnterMenu(): void {
    if (navigator.maxTouchPoints === 0) this.showCatalogue = true;
  }

  onMouseLeaveMenu(): void {
    if (this.mouseEnterTimeout) clearTimeout(this.mouseEnterTimeout);
    this.showCatalogue = false;
  }

   /*  onMouseEnterMenu(): void {
      if (navigator.maxTouchPoints === 0) {
        this.showCatalogue = true;
        if (this.mouseLeaveTimeout) {
          clearTimeout(this.mouseLeaveTimeout);
        }
      }
    }
  
    onMouseLeaveMenu(): void {
      if (this.mouseEnterTimeout) {
        clearTimeout(this.mouseEnterTimeout);
      }
      this.mouseLeaveTimeout = setTimeout(() => {
        this.showCatalogue = false;
      }, 3000); // 3 seconds delay
    }
 */
  getTelephoneNoSpace(tel: string): string {
    return this.authService.currentUser['COMMERCIALTEL2'].replace(/ /g, '').slice(1);
  }

  openCalatogue() {
    this.showCatalogue = true;
  }

  closeSubnav() {
    this.showSubnav = false;
  }

  toggleShowCatalogue(): void {
    this.showCatalogue = !this.showCatalogue;
  }

  protected readonly faPhone = faPhone;
  protected readonly faStar = faStar;
  protected readonly faChevronRight = faChevronRight;
  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faCogs = faCogs;
  protected readonly faCalendarAlt = faCalendarAlt;
}
