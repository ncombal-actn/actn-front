import {Component, OnDestroy, OnInit, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject, combineLatest, Observable, of, Subject} from 'rxjs';
import {AbstractControlOptions, FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {CatalogueSample, Filtre, Produit, User} from '@/_util/models';
import {map, publishReplay, refCount, skip, startWith, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {BreakpointObserver} from '@angular/cdk/layout';
import {ComparatorService} from '@/_core/_services/comparator.service';
import {SearchService} from '@core/_services/search.service';
import {AuthenticationService, LocalStorageService} from '@/_core/_services';
import {environment} from '@env';
import {BanniereComponent} from '@/banniere/banniere.component';
import {Chips} from '@/_util/components/chips-list/chips-list.component';
import {faThLarge, faThList} from "@fortawesome/free-solid-svg-icons";

type Format = 'list' | 'grid';

/**
 * Composant permettant le parcours du catalogue.
 */
@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss'],
  animations: [
    /**
     * Animation sur la hauteur de l'élément, alterne entre 0 et sa hauteur par défaut.
     * ! Ajouter directement overflow: hidden sur l'élément concerné si besoin de masquer son contenu.
     * L'ajout de cet attribut par l'animation ne fonctionne pas sur Safari !
     */
    trigger('expandVertical', [
      state(
        'open',
        style({
          height: '*'
        })
      ),
      state(
        'closed',
        style({
          height: '0'
        })
      ),
      transition('open => closed', animate('300ms ease-in-out')),
      transition('closed => open', animate('300ms ease-in-out'))
    ]),
    trigger('expandMarques', [
      state('closed', style({
        opacity: 0,
        visibility: 'hidden',
        transform: 'translateY(-10px)',
        margin: '0',
        border: 'none',
        height: '0px'
      })),
      state('open', style({
        opacity: 1,
        transform: 'translateY(0)',
        height: '*',
        margin: '5px',
        border: '3px solid rgba(0,0,0,.3)',
        visibility: 'visible',
      })),
      transition('closed => open', [
        animate('300ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0)',
          height: '*',
          margin: '5px',
          border: '3px solid rgba(0,0,0,.3)',
          visibility: 'visible',
        }))
      ]),
      transition('open => closed', [
        animate('300ms ease-in', style({
          opacity: 0,
          visibility: 'hidden',
          transform: 'translateY(-10px)',
          margin: '0',
          border: 'none',
          height: '0px',
        }))
      ])
    ])
  ]
})
export class CatalogueComponent implements OnInit, OnDestroy {

  /** Variable contenant un regroupement de variables d'environement vitales au site */
  environment = environment;

  /** Observable de nettoyage, déclanchée à la destruction du composant */
  _destroy$ = new Subject<void>();

  codeMarqueList = new Array<string>();
  @ViewChildren(BanniereComponent) banniereCompList: Array<BanniereComponent>;

  /**
   * Observable contenant la liste des filtres disponibles pour la position actuelle dans le catalogue.
   */
  filtres$: Observable<Filtre[]>;
  /**
   * Valeur subscribed de 'filtres$'
   */
  filtres: Filtre[] = [new Filtre()];
  /**
   * Element de 'filtres' séparé quand "filtres[i].label == 'marques'"
   */
  marques: Filtre = null;
  /**
   * Observable contenant la liste de tous les produits disponibles pour la position actuelle dans le catalogue.
   */
  produits$: Observable<Produit[]>;
  /**
   * Observable contenant un sous-ensemble de la liste des produits après application des filtres sélectionnés et de l'option de tri.
   */
  processedProduits$: Observable<Produit[]>;


  /**
   * Observable du nombre total de produits restant après application des filtres.
   */
  nbrResultats$: Observable<number>;

  /**
   * Tableau de tableaux représentant pour chaque filtre,
   * le nombre de produits disponibles pour chaque option possible en plus des filtres sélectionnés actuels.
   */
  nbrResultatsParFiltre: number[][] = [];
  /**
   * Format de présentation de la liste de produits, soit mode liste, soit mode vignettes.
   */
  format: Format = 'list';
  localFormat;
  /**
   * Nombre de produits à afficher / désafficher par étape de scroll.
   */
  productPerPage = 10;
  /**
   * Trigger pour l'ouverture ou la cloture du panneau de filtres.
   */
  showFiltres = false;
  showMarques = true;
  urlParams = null;
  order: string;
  etatFiltres$: Observable<any[]>;
  optionDeTri$: Observable<string>;
  error = false;
  shareLink = "test";

  squeletton = true;
  /** Chips des familles de produits */
  chipsFamille: Chips[] = [];
  /** Chips des sous-familles de produits */
  chipsSSFamille: Chips[] = [];
  /**
   * @param comparatorService Service utilisé pour la gestion du comparateur. Utilisé ici pour afficher,
   *  si non nul, le bouton permettant d'accéder au comparateur et le nombre de produits actuellement à comparer.
   * @param route Les données actuelles associées à la route.
   * @param fb Outil simplifiant l'association de contrôles aux formulaires.
   * @param breakpointObserver Observe la largeur de l'écran et déclenche un évènement si la largeur passe le cap donné.
   */
  optionDeTriSelector: FormControl;
  filtresForm: FormGroup
  showAllMarques = false;
  /**
   * Formulaire contenant le tableau des sélecteurs contenant les valeurs de filtres sélectionnées.
   */

  params: string;
  currentUser: User;
  protected readonly faThList = faThList;

  /**
   * Sélecteur représentant la valeur de l'option de tri sélectionnée.
   */
  protected readonly faThLarge = faThLarge;
  showMoreOptions = false;


  constructor(
    public comparatorService: ComparatorService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public breakpointObserver: BreakpointObserver,
    private searchService: SearchService,
    public authService: AuthenticationService,
    private router: Router,
    private localStorage: LocalStorageService,
    //   private chips: ChipsListComponent
  ) {

  }

  /**
   * Contient vrai si la largeur du conteneur du catalogue passe en dessous du breakpoint small.
   */
  _catalogueSmall = new BehaviorSubject<boolean>(false);

  /**
   * @returns true si la largeur du conteneur du catalogue est en-dessous du breakpoint small, sinon false.
   */
  get catalogueSmall() {
    return this._catalogueSmall.value;
  }

  /**
   * @returns Le FormArray correspondant à l'état actuel des sélecteurs de filtres.
   */
  get filtresSelectors() {
    return this.filtresForm.get('filtresSelectors') as FormArray;
  }

  /**
   * Initialisation de CatalogueComponent
   * - Abonnement à la taille de la page pour adapter le mode d'affichage du catalogue
   * - Récupère et traite les filtres et produits disponibles pour la position actuelle dans le catalogue
   * - Abonnement à l'utilisateur, afin de recharger la liste des produits à la (dé)connexion
   */
  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(skip(1), takeUntil(this._destroy$))
      .subscribe(() => {
        this.router.navigate([], {
          relativeTo: this.route,
          skipLocationChange: false,
          queryParams: { ...this.route.snapshot.queryParams }
        });
      });

    this.squeletton = true;

    this.optionDeTriSelector = this.fb.control('pertinence');
    this.breakpointObserver
      .observe(['(max-width: 1100px)'])
      .pipe(takeUntil(this._destroy$))
      .subscribe(s => {
        this._catalogueSmall.next(s.matches);
        this.showFiltres = !s.matches;
        this.format = s.matches ? 'grid' : 'list';
      });

    this.filtresForm = this.fb.group({
      filtresSelectors: this.fb.array([])
    } as AbstractControlOptions);

    this.route.data.pipe(
      takeUntil(this._destroy$),
      switchMap((data: { currentCatalogueState: CatalogueSample }) => {
        this.squeletton = true;
        this.setProduits(data.currentCatalogueState);
        this.setFiltres(data.currentCatalogueState);
        return combineLatest([data.currentCatalogueState.produits$, this.filtres$]);
      })
    ).subscribe({
      next: ([produits]) => {
        this.codeMarqueList = Array.from(new Set(produits.map(p => p.marque)));

        this.calculNbItemsParFiltre();
        this.etatFiltres$ = this.filtresSelectors.valueChanges.pipe(startWith(this.filtresSelectors.value));
        this.optionDeTri$ = this.optionDeTriSelector.valueChanges.pipe(startWith('pertinence'));
        this.setMajProduits();

        this.recoverUrlFilters();

        if (this.searchService.etatsFiltres.length > 0 && this.filtresSelectors.length > 0) {
          const savedFilters = this.searchService.etatsFiltres;
          for (let i = 0; i < savedFilters.length && i < this.filtresSelectors.length; i++) {
            if (savedFilters[i] && savedFilters[i].length > 0) {
              const currentValues = this.filtresSelectors.controls[i].value || [];
              const mergedValues = [...new Set([...currentValues, ...savedFilters[i]])];
              this.filtresSelectors.controls[i].patchValue(mergedValues);
            }
          }
        }

        this.squeletton = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du catalogue:', error);
        this.squeletton = false;
      }
    });

    this.localFormat = this.localStorage.getItem('ActnCalogueFormat');
    if (this.localFormat) {
      this.format = this.localFormat;
    }
  }


  toggleShowAllMarques() {
    this.showAllMarques = !this.showAllMarques;
  }

  /** lit les parametres d'URL et préremplit les filtres correspondant avec les arguments attachés */
  recoverUrlFilters() {
    const urlParams = this.route.snapshot.queryParams;
    this.urlParams = urlParams;

    if (!urlParams || Object.keys(urlParams).length === 0) {
      return;
    }

    const urlParamsLabels = Object.keys(urlParams);
    let hasAppliedFilters = false;

    for (let i = 0; i < urlParamsLabels.length; i++) {
      const paramName = urlParamsLabels[i];
      const paramValue = urlParams[paramName];

      const retIndex = this.labelIndexOfFiltres(paramName, this.filtres);

      if (retIndex >= 0 && this.filtresSelectors.controls[retIndex]) {
        const optionValues = Array.isArray(paramValue) ? paramValue : [paramValue];

        const validOptions = optionValues.filter(opt => {
          return this.filtres[retIndex].options.includes(opt);
        });

        if (validOptions.length > 0) {
          this.filtresSelectors.controls[retIndex].patchValue(validOptions);
          hasAppliedFilters = true;
        }
      }
    }
    if (hasAppliedFilters) {
      this.filtresSelectors.updateValueAndValidity({ onlySelf: false, emitEvent: true });
    }
  }

  /**
   * Prépare l'observable des produits.
   * @param catalogueSample Objet contenant les filtres et les produits associés à la recherche en cours
   */
  setProduits(catalogueSample: CatalogueSample): void {
    // Récupère l'observable des produits
    this.produits$ = catalogueSample.produits$;
    this.produits$
      .pipe(take(1))
      .subscribe(p => {

        this.error = p[0].marque == null;
        if (this.error) {
          this.format = 'list';
          this.localStorage.setItem('ActnCalogueFormat', 'list');
        }
      });
  }

  hasFormValue(): boolean {
    return Object.values(this.filtresForm.value).some(value => value !== null && value !== '');
  }

  /**
   * Prépare l'observable des filtres.
   * @param catalogueSample Objet contenant les filtres et les produits associés à la recherche en cours
   */
  setFiltres(catalogueSample: CatalogueSample): void {

    // Provide a fallback observable if catalogueSample.filtres$ is null
    const filtres$ = catalogueSample.filtres$ ? catalogueSample.filtres$ : of([]);


    this.filtres$ = filtres$
      .pipe(
        take(1),
        switchMap((filtres) =>
          this.produits$.pipe(
            map((produits) => {


              if (!filtres) {
                filtres = [];
              }
              // Si il n'y a pas de filtre disponible pour les marques, le construit à partir des produits résultats
              if (filtres.find((filtre) => filtre.label === 'Marque') == undefined) { //null avant


                const marques = new Set<string>();
                produits.forEach((produit) => {

                  if (produit.marquelib != null) { //marquelib ppur produit normal
                    marques.add(produit.marquelib);
                  }
                });
                if (marques.size > 0) {
                  const filtreMarque = new Filtre();
                  filtreMarque.label = 'Marque';
                  filtreMarque.options = Array.from(marques).sort((a: any, b: any) => a - b);
                  filtreMarque.target = 'marquelib'; //marque
                  filtres = Array.of(filtreMarque).concat(filtres);
                }
              }


              filtres = filtres.concat(this.chargementFamilles(produits)); //Bizzare ct en comm avant voir si sa fait déconner
              return filtres;
            })
          )
        ),
        tap((filtres) => {
          // Réinitialise les sélecteurs associés aux filtres.
          this.filtresSelectors.clear();
          for (const filtre of filtres) {
            this.filtresSelectors.push(this.fb.control([]));
            this.nbrResultatsParFiltre.push([]);
          }
        }),
        publishReplay(1),
        refCount()
      );

    this.filtres$.pipe(take(1)).subscribe((ret) => {
      this.filtres = ret;

      this.recoverUrlFilters();
    });
  }

  reloadPageIfUserChanged(user: any): void {
    if (this.currentUser?.id !== user?.id) {
      this.currentUser = this.authService.currentUser;
      window.location.reload();
    }
  }

  /**
   * Calcule une première fois le nombre de résultats pour chaque option de filtres avant qu'aucun filtre ne soit sélectionné.
   */
  calculNbItemsParFiltre(): void {
    combineLatest([this.produits$, this.filtres$])
      .pipe(take(1))
      .subscribe(([produits, filtres]) => {
        filtres.forEach((filtre, i) => {
          filtre.options.forEach((option, j) => {
            // Construit une version factice de l'état des filtres où seule l'option concernée serait sélectionnée
            const mockSelectors = Array<any[]>(
              this.filtresSelectors.length
            );
            mockSelectors.fill([]);
            mockSelectors[i] = [option];
            // Enregistre la taille du tableau de produits filtrés obtenu avec la version factice de l'état des filtres,
            // soit le nombre de produits disponible quand seule l'option concernée est sélectionnée.
            this.nbrResultatsParFiltre[i][j] = this.filtrerProduits(
              produits,
              filtres,
              mockSelectors
            ).length;
          });
        });
      });
  }

  /**
   * Met à jour les produits filtrés / triés à chaque fois qu'une nouvelle version des produits,
   * des filtres, de l'état des filtres, ou de l'état de l'option de tri est disponible.
   */
  setMajProduits(): void {
    this.processedProduits$ = combineLatest([
      this.produits$,
      this.filtres$,
      this.etatFiltres$,
      this.optionDeTri$
    ])
      .pipe(switchMap(([produits, filtres, etatFiltres, optionDeTri]) => {
        let produitsFiltres: Produit[];
        // Si au moins une valeur de filtre a été sélectionnée, on filtre les produits.
        if (etatFiltres.reduce((acc, select) => acc || !!select.length, false)) {
          produitsFiltres = this.filtrerProduits(produits, filtres, etatFiltres);
        } else {
          produitsFiltres = produits;
        }
        this.nbrResultats$ = of(produitsFiltres.filter(produit => produit.marque).length);

        filtres.forEach((filtre, i) => {
          filtre.options.forEach((option, j) => {
            const mockSelectors = [...etatFiltres];
            mockSelectors[i] = [option];
            this.nbrResultatsParFiltre[i][j] = this.filtrerProduits(produits, filtres, mockSelectors).length;
            if (i === filtres.length - 2) {
              const x = this.chipsFamille.find(e => e.value === option);
              if (x) x.count = this.nbrResultatsParFiltre[i][j];
            }
            if (i === filtres.length - 1) {
              const x = this.chipsSSFamille.find(e => e.value === option);
              if (x) x.count = this.nbrResultatsParFiltre[i][j];
            }
          });
        });


        this.chipsFamille = Array.from(this.sortChips(this.chipsFamille));
        this.chipsSSFamille = Array.from(this.sortChips(this.chipsSSFamille));

        return of(produitsFiltres)
          .pipe(map(produitsFiltres =>
            this.sortProducts(produitsFiltres, optionDeTri)
          ));
      }));
  }

  /**
   * Active ou désactive un champ de marque 'option' du filtre
   */
  filtreMarqueToggle(option: string) {
    let tab = [];

    if (this.filtresSelectors.value[0].includes(option)) {
      const i = this.filtresSelectors.value[0].indexOf(option);
      this.filtresSelectors.value[0].splice(i, 1);
      this.filtresSelectors.controls[0].patchValue(this.filtresSelectors.value[0]);
    } else {
      tab = this.filtresSelectors.value[0];
      tab.push(option);
      this.filtresSelectors.controls[0].patchValue(tab);
    }
    // this.filtresForm.updateValueAndValidity({ onlySelf: false, emitEvent: true });
    this.filtresSelectors.updateValueAndValidity({onlySelf: false, emitEvent: true});

    // this.chips.init();
  }

  resetFilterMarque() {
    // Assuming the "marque" filter is the first control in the filtresSelectors FormArray
    this.filtresSelectors.controls[0].patchValue([]);
    this.filtresSelectors.updateValueAndValidity({ onlySelf: false, emitEvent: true });
  }

  /**
   * Ajoute au filtre indexé en 'indexOfFilter' de la page la ou les valeurs 'option'
   */
  addOptionToIndexedFilter(indexOfFilter: number, option: string | string[], shouldUpdate: boolean = false): void {
    let tab = [];

    // SI l'option est bien un string
    // ELSE boucle sur la fonction 'addOptionToIndexedFilter()' pour ajouter chaque élément du tableaux de string
    if (typeof (option) == "string") {
      // SI l'option existe dans le filtres[indexOfFilter] correspondant
      // ELSE aucun filtre n'est ajouté
      if (this.filtres[indexOfFilter] && this.filtres[indexOfFilter].options.includes(option)) {
        // Ajouter la valeur au filtre
        tab = this.filtresSelectors.value[indexOfFilter] || [];
        if (!tab.includes(option)) {
          tab.push(option);
          this.filtresSelectors.controls[indexOfFilter].patchValue(tab);
        }
      }
      if (shouldUpdate) {
        this.filtresSelectors.updateValueAndValidity({onlySelf: false, emitEvent: true});
      }
    } else if (Array.isArray(option)) {
      for (let i = option.length - 1; i >= 0; i--) {
        this.addOptionToIndexedFilter(indexOfFilter, option[i], false);
      }
      if (shouldUpdate) {
        this.filtresSelectors.updateValueAndValidity({onlySelf: false, emitEvent: true});
      }
    }
  }

  /**
   * Filtre un tableau de produits en fonction d'un tableau de valeurs de filtres.
   * @param produits Le tableau de produits à filtrer.
   * @param filtres La liste complète des filtres disponibles.
   * @param filtresSelectors Tableau de tableaux représentant les valeurs actuelles des sélecteurs correspondant aux filtres disponibles.
   *  Chaque sous-tableau contient les différentes options disponible pour un filtre qui ont été sélectionnées.
   * @returns Un nouveau tableau correspondant au tableau de produits original filtré.
   */
  filtrerProduits(
    produits: Produit[],
    filtres: Filtre[],
    filtresSelectors: any[]
  ) {
    return produits.filter(
      (produit) => {
        return filtresSelectors.reduce(
          (acc, select, index) => {
            return (
              (acc && !select.length) ||
              (acc && select.includes(produit[filtres[index].target]))
            );
          },
          true
        );
      }
    );
  }

  /**
   * Tri un tableau de produit en fonction d'une option de tri
   * @param produits Le tableau de produits à trier.
   * @param sortOption L'option de trie sélectionnée.
   * @returns Le tableau de produits trié.
   */
  sortProducts(produits: Produit[], sortOption: string) {
    produits.sort((a, b) => {
      if (sortOption === 'pertinence') {
        return a.prix - b.prix;
      }
      if (sortOption === 'az') {
        return a.reference.localeCompare(b.reference, 'fr-FR');
      }
      if (sortOption === 'za') {
        return b.reference.localeCompare(a.reference, 'fr-FR');
      }
      if (sortOption === 'prixAsc') {
        return a.prix - b.prix;
      }
      if (sortOption === 'prixDesc') {
        return b.prix - a.prix;
      }
    });

    // TRI PAR DISPONIBILITE
    let aStock;
    let bStock;
    if (sortOption === 'pertinence') {
      produits.sort((a, b) => {
        aStock = 0;
        bStock = 0;
        if (a.qteStock1 > 0) {
          aStock = 2;
        } else if (a.qteEnReappro > 0) {
          aStock = 1;
        }
        if (b.qteStock1 > 0) {
          bStock = 2;
        } else if (b.qteEnReappro > 0) {
          bStock = 1;
        }
        return (bStock - aStock);
      });
    }

    return produits;
  }

  /**
   * Pass l'affichage des produits en mode liste.
   */
  listFormat() {
    if (!this.error) {
      this.format = 'list';
      this.localStorage.setItem('ActnCalogueFormat', 'list');
    }
  }

  /**
   * Passe l'affichage des produits en mode vignettes.
   */
  gridFormat() {
    if (!this.error) {
      this.format = 'grid';
      this.localStorage.setItem('ActnCalogueFormat', 'grid');
    }
  }

  /**
   * Handler déclenché lorsque le trigger du panneau contenant les filtres est actionné.
   * @param event
   */
  onFiltresTogglePressed(event) {
    // On vérifie que l'on a pas à faire à un sous-évenement pour ne pas déclencher plusieurs fois le handler.
    if (!event.srcEvent) {
      this.showFiltres = !this.showFiltres;
    }
  }

  onMarquesTogglePressed(event) {
    // On vérifie que l'on a pas à faire à un sous-évenement pour ne pas déclencher plusieurs fois le handler.
    if (!event.srcEvent) {
      this.showMarques = !this.showMarques;
    }
  }

  /**
   * Force the update of the catalogue product list
   */
  update() {
    this.filtresSelectors.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  /**
   * Reset all the filters
   * or the filter at the position given by 'filterNbr'
   */
  resetFilters(filterNbr = -1) {
    // RESET FILTERS
    if (filterNbr != -1) {
      this.filtresSelectors.controls[filterNbr].patchValue([]);
    } else {
      for (let i = this.filtresSelectors.value.length - 1; i >= 0; i--) {
        this.filtresSelectors.controls[i].patchValue([]);
      }
    }

    this.update();
  }

  /**
   * If 'filtres' contain a label equal to 'label' (case insensitive)
   * @Return the index of the filter corresponding, otherwise return -1
   */
  labelIndexOfFiltres(label: string, filtres: Filtre[]): number {
    if (!filtres || !label) {
      return -1;
    }

    const normalizedLabel = label.toLowerCase();

    for (let i = 0; i < filtres.length; i++) {
      if (filtres[i] && filtres[i].label &&
        filtres[i].label.toLowerCase() === normalizedLabel) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Renvois un string contenant le lien de la page incluant les filtres selectionnés
   */
  linkOfSelection(): string {


      let link: string = this.router.url.split('?')[0] + "?";

      // SI il existe un parametre d'URL de recherche 'search'
      //  on le garde
      if (this.urlParams) {
        if (this.urlParams['search']) {
          link = link + "search=" + this.urlParams['search'];
        }
        if (this.urlParams['marque']) {
          link = link + "marque=" + this.urlParams['marque'];
        }
      }

      // POUR chaque filtre
      for (let i = this.filtresSelectors.value.length - 1; i >= 0; i--) {
        // POUR chaque option activée du filtre
        for (let j = this.filtresSelectors.value[i].length - 1; j >= 0; j--) {
          link = link + "&" + this.filtres[i].label + "=" + this.filtresSelectors.value[i][j];
        }
      }

      this.shareLink = link.replace(" ", "%20");


      return ( 'https://www.actn.fr'+link.replace(" ", "%20"));

  }

  /** Destruction de CatalogueComponent */
  ngOnDestroy(): void {
    // Sauvegarde l'état des filtres
    this.searchService.etatsFiltres = this.filtresSelectors.value;

    this._destroy$.next();
    this._destroy$.complete();
  }


  /**
   * Crée 2 filtres sur les familles et sous-familles d'une liste de produits.
   * @param produits Une liste de produits
   * @returns Deux filtres
   */
  chargementFamilles(produits: Array<Produit>): Array<Filtre> {
    const filtreFamille = new Filtre();
    filtreFamille.label = 'Famille';
    filtreFamille.target = 'niveaucode2';
    filtreFamille.type = 'hidden';
    filtreFamille.options = [];

    const filtreSSFamille = new Filtre();
    filtreSSFamille.label = 'Sous-Famille';
    filtreSSFamille.target = 'niveaucode3';
    filtreSSFamille.type = 'hidden';
    filtreSSFamille.options = [];

    if (['search', 'nouveautes', 'packs', 'destockage', 'promotions','similaire','repackaging'].some(path => this.router.url.includes(path))) {
      const categoriesNiv2 = new Map<string, Array<string | number>>();
      const categoriesNiv3 = new Map<string, Array<string | number>>();

      produits.forEach(produit => {
        // Famille (niveau 2)
        if (produit['niveaulibelle2'] !== '' && produit['niveaulibelle2'] !== '_' && produit['niveaulibelle2'] !== '.') {
          categoriesNiv2.set(produit['niveaucode2'], [
            produit['niveaulibelle2'],
            2,
            (categoriesNiv2.get(produit['niveaucode2'])?.[2] ?? 0) as number + 1,
            produit['niveaulibelle1'] + ' - ' + produit['niveaulibelle2']
          ]);

          // Sous-famille (niveau 3)
          if (produit['niveaulibelle3'] !== '' && produit['niveaulibelle3'] !== '_' && produit['niveaulibelle3'] !== '.') {
            categoriesNiv3.set(produit['niveaucode3'], [
              produit['niveaulibelle3'],
              3,
              (categoriesNiv3.get(produit['niveaucode3'])?.[2] ?? 0) as number + 1,
              produit['niveaulibelle3']
            ]);
          } else if (produit['niveaulibelle4'] !== '' && produit['niveaulibelle4'] !== '_' && produit['niveaulibelle4'] !== '.') {
            categoriesNiv3.set(produit['niveaucode3'], [
              produit['niveaulibelle4'],
              3,
              (categoriesNiv3.get(produit['niveaucode3'])?.[2] ?? 0) as number + 1,
              produit['niveaulibelle4']
            ]);
          }
        }
      });

      // Les options des filtres sont les CODES (pas les libellés)
      filtreFamille.options = [...categoriesNiv2].filter(c => c[1][1] === 2).map(e => e[0]);
      filtreSSFamille.options = [...categoriesNiv3].filter(c => c[1][1] === 3).map(e => e[0]);

      // Créer les chips pour l'affichage
      this.chipsFamille = this.sortChips([...categoriesNiv2]
        .filter(e => e[1][1] === 2 && e[1][0] !== '')
        .reduce((acc, val) => acc.concat({
          value: val[0],
          libelle: val[1][0],
          count: val[1][2],
          tooltip: val[1][3]
        }), []));

      this.chipsSSFamille = this.sortChips([...categoriesNiv3]
        .filter(e => e[1][1] === 3 && e[1][0] !== '')
        .reduce((acc, val) => acc.concat({
          value: val[0],
          libelle: val[1][0],
          count: val[1][2],
          tooltip: val[1][3]
        }), []));
    }

    return new Array<Filtre>(filtreFamille, filtreSSFamille);
  }

  /**
   * Tri une liste de chips alphabétiquement avec les éléments dont le compte = 0 à la fin.
   * @param liste Une liste de chips
   * @returns La liste de chips triée
   */
  sortChips(liste: Chips[]): Chips[] {
    return liste?.sort((a, b) => {
      // Vérifie si a.libelle et b.libelle sont définis
      if (a.libelle !== undefined && b.libelle !== undefined) {
        if (a.count === 0 && b.count !== 0) return 100000;
        if (a.count !== 0 && b.count === 0) return -100000;
        return a.libelle.localeCompare(b.libelle);
      } else {
        // Gérez le cas où l'une des propriétés libelle est undefined
        if (a.libelle === undefined && b.libelle === undefined) {
          return 0;
        } else if (a.libelle === undefined) {
          return 1;
        } else {
          return -1;
        }
      }
    }) ?? [];
  }
}
