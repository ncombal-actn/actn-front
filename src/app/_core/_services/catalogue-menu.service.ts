import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, of, Subject} from 'rxjs';
import {Categorie, Tree} from '@/_util/models';
import {debounceTime, delay, filter, skip, switchMap, take, takeUntil, withLatestFrom} from 'rxjs/operators';
import {WindowService} from './window/window.service';
import {ComponentsInteractionService} from './components-interaction.service';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BreakpointObserver} from '@angular/cdk/layout';

import {environment} from '@env';
import {CatalogueService} from './catalogue.service';
import {AuthenticationService} from './authentication.service';
import {ComparateurService} from '@/_core/_services/comparateur.service';
import {FavorisService} from '@/_core/_services/favoris.service';
import {Cacheable} from "ts-cacheable";

@Injectable({
  providedIn: 'root'
})
export class CatalogueMenuService implements OnInit, OnDestroy {

  structureCatalogue: Observable<Tree<Categorie>>;
  listeRessources = null;

  currentActiveCategorieIndex = new BehaviorSubject<number>(null);
  currentSubCategoriesContainer = new BehaviorSubject<HTMLElement>(null);

  showCatalogue = false;
  showRessources = false;
  showActual = false;
  showSubnav = false;

  onCatalogueCategorieHoveredIndex = new BehaviorSubject<number>(null);
  onCatalogueCategorieTappedIndex = new BehaviorSubject<number>(null);
  onCatalogueSousCategoriesContainerHoveredIndex = new BehaviorSubject<number>(null);
  onCatalogueSousCategoriesContainerTappedIndex = new BehaviorSubject<number>(null);
  onSubnavTriggerClickedOrTapped$ = new Subject<boolean>();

  comparateurReferences: string[] = [];
  favorisReferences: string[] = [];

  isPopUp = false;
  promotionHoveredInt = -1;
  nosMarquesHoveredInt = -2;
  nosMetiersHoveredInt = -3;
  selectedSideNavMenu = '';
  public catalogue$: Observable<[boolean, HTMLElement]>;
  private _mouseEnterTimeout: number = null;
  private _destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private window: WindowService,
    private catalogueService: CatalogueService,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthenticationService,
    public componentsInteractionService: ComponentsInteractionService,
    private comparateurService: ComparateurService,
    private favorisService: FavorisService
  ) {
    this.comparateurReferences = this.comparateurService.setUp();
    if (this.comparateurReferences[0] == '') {
      this.comparateurReferences = [];
    }
    this.favorisReferences = this.favorisService.setUp();
    if (this.favorisReferences[0] == '') {
      this.favorisReferences = [];
    }

    this.structureCatalogue = this.catalogueService.getStructure();

    /* this.authService.currentUser$.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.getRessources()
        .pipe(takeUntil(this._destroy$))
        .subscribe((data) => {
          this.listeRessources = data;
        });
    }); */

    this.catalogue$ = combineLatest(
      this.onCatalogueCategorieHoveredIndex,
      this.onCatalogueSousCategoriesContainerHoveredIndex)
      .pipe(
        debounceTime(100),
        switchMap(
          ([hoveredCategorie, currentHoveredSubCategoriesContainer]) => {
            if (
              currentHoveredSubCategoriesContainer === null &&
              !this.subNavSmall
            ) {
              this.currentActiveCategorieIndex.next(hoveredCategorie);
              return of(false);
            } else {
              return of(true);
            }
          }
        ),
        filter(subCategoriesLocked => !subCategoriesLocked),
        delay(50),
        withLatestFrom(this.currentSubCategoriesContainer.pipe(skip(1)))
      );

    this.breakpointObserver
      .observe(['(max-width: 767.98px)'])
      .subscribe(state => {
        this._subNavSmall.next(state.matches);
      });

    this.breakpointObserver
      .observe(['(min-width: 1650px)'])
      .subscribe(state => {
        this._subNavXLarge.next(state.matches);
      });

    this.breakpointObserver
      .observe(['(min-width: 1300px)'])
      .subscribe(state => {
        this._subNavLarge.next(state.matches);
      });

    this.breakpointObserver
      .observe(['(min-width: 950px)'])
      .subscribe(state => {
        this._subNavMedium.next(state.matches);
      });

    // s'abonne et met à jour 'comparateurReferences' à chaque modification dans le service 'ComparateurService'
    this.comparateurService
      .compare()
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (ret) => {
          this.comparateurReferences = ret;
        }
      );

    // s'abonne et met à jour 'comparateurReferences' à chaque modification dans le service 'FavorisService'
    this.favorisService
      .favoris()
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (ret) => {
          this.favorisReferences = ret;
        }
      );
  }

  private _subNavSmall = new BehaviorSubject<boolean>(false);

  get subNavSmall() {
    return this._subNavSmall.value;
  }

  private _subNavXLarge = new BehaviorSubject<boolean>(false);

  get subNavXLarge() {
    return this._subNavXLarge.value;
  }

  private _subNavLarge = new BehaviorSubject<boolean>(false);

  get subNavLarge() {
    return this._subNavLarge.value;
  }

  private _subNavMedium = new BehaviorSubject<boolean>(false);

  get subNavMedium() {
    return this._subNavMedium.value;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  @Cacheable()
  public getRessources(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/ListeRessources.php`, {
      withCredentials: true,
      responseType: 'json'
    });
  }

  /**
   * Déclenche l'ouverture de la side-nav.
   * @param selectedMenu Menu sur lequel ouvrir la side-nav (exemple : 'espace-client')
   */
  openSideNav(selectedMenu: string) {
    this.componentsInteractionService.sideNavigationLine.fireOpenSideNav(
      selectedMenu
    );
  }

  navigateCataloguePath(path) {
    this.router.navigate(['/catalogue/' + path]);
    this.showSubnav = false;
    this.showCatalogue = false;
    this.currentActiveCategorieIndex.next(null);
  }

  /**
   * Handler déclenchant lorsqu'une nouvelle recherche par mot clé vient d'être lancée.
   * Permet de fermer tous les menus concernant le catalogue.
   */
  onSearch() {
    this.showSubnav = false;
    this.showCatalogue = false;
    this.showRessources = false;
    this.showActual = false;
    this.currentActiveCategorieIndex.next(null);
  }

  /**
   * Recule d'un niveau dans le menu du catalogue. Disponible seulement au format small.
   */
  onBackButton() {
    this.currentActiveCategorieIndex.next(null);
  }

  /**
   * Navigue vers le catalogue, au niveau indiqué par niveaux.
   * Ferme également les menus ouverts associés au catalogue.
   * @param niveaux Tableau contenant les niveaux (catégorie, sous-catégorie, ...) sélectionnés pour la navigation
   */
  onCatalogueNiveauSelected(...niveaux: any[]) {
    if (niveaux.length === 3) {

      this.structureCatalogue.pipe(take(1)).subscribe(
        (categories) => {
          const subcategories = categories.nodes.find((subcat) => {
            return (subcat.value.label == niveaux[1])
          });
          const subsubcategories = subcategories.nodes.find((subsubcat) => {
            return (subsubcat.value.label == niveaux[2])
          });
          if (!!subsubcategories.nodes && subsubcategories.nodes.length > 1) {
            this.router.navigate(['/catalogue/' + niveaux[1] + '/' + niveaux[2]]);
            this.showSubnav = false;
            this.showCatalogue = false;
          } else {
            this.router.navigate(['/catalogue/' + niveaux[1] + '/' + niveaux[2] + '/unique']);
            this.showSubnav = false;
            this.showCatalogue = false;
          }
        }
      );

      /*this.router.navigate(['/catalogue/' + niveaux[1] + '/' + niveaux[2] + '/unique']);
      this.showSubnav = false;
      this.showCatalogue = false;*/
    } else {
      this.router.navigate(niveaux);
      this.showSubnav = false;
      this.showCatalogue = false;
      this.currentActiveCategorieIndex.next(null);
    }
  }

  onMouseEnterMenu(): void {
    if (navigator.maxTouchPoints === 0) {
      if (this._mouseEnterTimeout != null) {
        // clearTimeout(this.mouseEnterTimeout);
      }
      this._mouseEnterTimeout = window.setTimeout(() => this.showCatalogue = !this.subNavSmall);
    } else {
      this.showCatalogue = true;
    }
  }

  onMouseLeaveMenu(): void {
    if (this._mouseEnterTimeout != null) {
      clearTimeout(this._mouseEnterTimeout);
    }
    this.showCatalogue = false;
  }
}
