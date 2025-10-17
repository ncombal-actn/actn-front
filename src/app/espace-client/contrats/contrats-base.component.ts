import {AfterViewInit, Directive, ElementRef, NgZone, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {LicenceService} from '@services/licence.service';
import {BehaviorSubject, fromEvent, Observable, Subject} from 'rxjs';
import {debounceTime, map, skip, take, takeUntil, tap} from 'rxjs/operators';
import {CartItem, CataloguePosition, Client, Filtre, Licence, Produit} from '@/_util/models';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ProduitService} from '@core/_services/produit.service';
import {AdresseService, SortAndFilterService, WindowService} from '@core/_services';
import {
  faBell,
  faBellSlash,
  faCheckCircle,
  faHistory,
  faMinusCircle,
  faPenSquare,
  faPlusCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import {PageEvent} from "@angular/material/paginator";
import {environment} from '@env';

export interface FiltreDate {
  label: string;
  options: Array<string>;
}

@Directive()
export abstract class ContratsBaseComponent implements OnInit, OnDestroy, AfterViewInit {

  environment = environment;
  historyShow: Array<boolean> = [];
  editShow: Array<boolean> = [];
  stringsNoSerie: Array<string> = [];
  filtres$: Observable<Array<Filtre>>;
  selectedTab = new FormControl(0);
  filtreMarque: Filtre;
  prioritaire = true;
  showPopup = false;
  licencePopup: Licence;
  produits: { [reference: string]: CartItem; };
  clientPopup: Client;
  showHelpPopup = false;
  isAskingForHelp = false;
  demandeAideEnvoyee = false;
  commentaire = '';
  produitHelpPopup: Produit;
  produitsSimilaires: Array<Produit>;
  filtresForm: FormGroup;

  @ViewChildren('licence') protected _listeLicences: QueryList<ElementRef>;
  protected _destroy$ = new Subject<void>();
  protected _licences: Array<Licence> = [];
  protected _now = new Date();
  protected _date = new Date();
  protected _pageID = 'licence';
  protected _defaultSort = 'renouvellementdate';

  protected readonly faPenSquare = faPenSquare;
  protected readonly faCheckCircle = faCheckCircle;
  protected readonly faTimesCircle = faTimesCircle;
  protected readonly faPlusCircle = faPlusCircle;
  protected readonly faMinusCircle = faMinusCircle;
  protected readonly faHistory = faHistory;
  protected readonly faBellSlash = faBellSlash;
  protected readonly faBell = faBell;

  protected _processedLicences$ = new BehaviorSubject<Array<Licence>>([]);

  constructor(
    public licenceService: LicenceService,
    public produitService: ProduitService,
    protected fb: FormBuilder,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    public adresseService: AdresseService,
    protected ngZone: NgZone,
    protected window: WindowService,
    protected saf: SortAndFilterService,
  ) {}

  get filtreValues(): Array<unknown> {
    return this.licenceService.filtreValues;
  }

  get filtreTout(): string {
    return this.licenceService.filtreTout;
  }

  get filtresExpirant(): Array<string> {
    return this.licenceService.filtresExpirant;
  }

  get filtresExpire(): Array<string> {
    return this.licenceService.filtresExpire;
  }

  get filtresDate(): Array<FiltreDate> {
    return this.licenceService.filtresDate;
  }

  get selectedFiltreDate(): string {
    return this.licenceService.selectedFiltreDate;
  }

  set selectedFiltreDate(value: string) {
    this.licenceService.selectedFiltreDate = value;
  }

  get paginator(): {
    pageIndex: number;
    pageSize: number;
    pageSizeOptions: number[];
    previousPageIndex: number;
    low: number;
    high: number;
  } {
    return this.licenceService.paginator;
  }

  get detailsShow(): Array<boolean> {
    return this.licenceService.details;
  }

  get processedLicences$(): Observable<Array<Licence>> {
    return this._processedLicences$.asObservable().pipe(map(licences => {
      if (this.prioritaire) {
        const splittedLicences = this.splitPrioritaire(licences);
        return [].concat(splittedLicences[0]).concat(splittedLicences[1]);
      } else {
        return licences;
      }
    }));
  }

  ngOnInit(): void {
    this.filtresForm = this.fb.group({});
    this.saf.setTri(this._pageID, this._defaultSort, 'date', 'desc');

    this.processedLicences$
      .pipe(skip(1), takeUntil(this._destroy$))
      .subscribe(() => {
        this.paginator.low = 0;
        this.paginator.high = this.paginator.pageSize;
        this.paginator.pageIndex = 0;
      });

    this.licenceService.getLicences();

    this.licenceService.licences$.pipe(
      map((licences: Array<Licence>) => licences.filter((licence: Licence) => licence.produit.reference !== '')),
      takeUntil(this._destroy$)
    ).subscribe((licences) => {
      this._licences = licences;
      this.filtres$ = this.licenceService.getFiltres()
        .pipe(
          takeUntil(this._destroy$),
          map((filtres: Array<Filtre>) => {
            const marques = new Set<string>();
            this._licences.forEach(licence => marques.add(licence.produit.marque));
            filtres.find((filtre: Filtre) => (filtre.target as string).includes('marque')).options = Array.from(marques).sort((a: any, b: any) => (a - b));
            return filtres;
          }),
          tap((filtres: Array<Filtre>) => {
            this.filtreMarque = filtres.find((filtre: Filtre) => (filtre.target as string).includes('marque'));
            filtres.forEach((filtre: Filtre) => {
              this.filtresForm.addControl(filtre.target as string, new FormControl(''));
              this.filtreValues[filtre.target] = this.saf.getFiltre(this._pageID, filtre.target as string, filtre.method) ?? [];
            });
          }));
    });

    this.ngZone.runOutsideAngular(() => {
      fromEvent(window.document, 'scroll')
        .pipe(
          skip(1),
          debounceTime(20),
          takeUntil(this._destroy$))
        .subscribe(() => {
          this.licenceService.scroll = window.pageYOffset;
        });
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  ngAfterViewInit(): void {
    this._listeLicences.changes
      .pipe(
        takeUntil(this._destroy$),
        debounceTime(100)
      ).subscribe(() => {
      window.scrollTo(0, this.licenceService.scroll);
    });
  }

  isActive(index: number): boolean {
    return !!this.detailsShow[index];
  }

  isHistoryActive(index: number): boolean {
    return !!this.historyShow[index];
  }

  isEditing(index: number): boolean {
    return !!this.editShow[index];
  }

  showDetails(index: number): void {
    this.detailsShow[index] = !this.detailsShow[index];
    this.adresseService.getCountryFromCode(this._licences[index].client.pays).subscribe(pays => {
      this._licences[index].client.pays = this.adresseService.getNameOfCountry(pays);
    });
  }

  showHistory(index: number): void {
    this.historyShow[index] = !this.historyShow[index];
  }

  startEdit(index: number, licence: Licence): void {
    this.stringsNoSerie[index] = licence.serie;
    this.editShow[index] = true;
  }

  stopEdit(index: number): void {
    this.stringsNoSerie[index] = '';
    this.editShow[index] = false;
  }

  editNoSerie(index: number, licence: Licence): void {
    licence.client.serie = this.stringsNoSerie[index];
    licence.serie = this.stringsNoSerie[index];
    this.licenceService.postEnduser(licence.client, licence.commande.numcommande)
      .subscribe(() => {
        this.licenceService.majEnduser().pipe(take(1)).subscribe(() => {
          this.stopEdit(index);
        });
      });
  }

  selected(s: string): string {
    return this.saf.getTri(this._pageID)[0] === s ? this.saf.getTri(this._pageID)[1] : 'off';
  }

  getFiltre(filterTarget: string, filterMethod: string): unknown {
    return this.saf.getFiltre(this._pageID, filterTarget, filterMethod);
  }

  filtreMarqueToggle(marque: string): void {
    if (this.filtreValues['produit.marque'].includes(marque)) {
      this.filtreValues['produit.marque'].splice(this.filtreValues['produit.marque'].findIndex(ms => ms === marque));
    } else {
      this.filtreValues['produit.marque'].push(marque);
    }
    this.filtreValues['produit.marque'] = [].concat(this.filtreValues['produit.marque']);
    setTimeout(() => this._processedLicences$.next(this.saf.onFiltre(this._pageID, 'produit.marque', 'array', 'includes', this.filtreValues['produit.marque'], this._licences)), 1);
  }

  onSearch(target: string, type: string, method: string, event: string, values?: string): void {
    if (values) {
      setTimeout(() => this._processedLicences$.next(this.saf.onFiltre(this._pageID, target, type, method, values, this._licences)), 1);
    } else {
      setTimeout(() => this._processedLicences$.next(this.saf.onFiltre(this._pageID, target, type, method, event['target'].value != null ? event['target'].value : event['target'].innerText, this._licences)), 1);
    }
  }

  splitPrioritaire(licences: Array<Licence>): [Array<Licence>, Array<Licence>] {
    const prio = licences.filter(licence => this.licenceService.isPrioritaire(licence));
    licences = licences.filter(licence => !prio.includes(licence));
    return [prio, licences];
  }

  onTri(s: string, type: string): void {
    this._processedLicences$.next(this.saf.onTri(this._pageID, s, type, this._processedLicences$.value));
  }

  onFiltreDate(): void {
    this._date = new Date();
    switch (this.selectedFiltreDate) {
      case this.filtresDate[0].options[0]:
        this._date.setDate(this._now.getDate() + 7);
        this._processedLicences$.next(this.saf.onFiltre(this._pageID, 'renouvellementdate', 'date', 'GE', this._now, this._licences));
        this._processedLicences$.next(this.saf.onFiltre(this._pageID, 'renouvellementdate', 'date', 'LE', this._date, this._licences));
        break;
      case this.filtresDate[0].options[1]:
        this._date.setDate(this._now.getDate() + 15);
        this._processedLicences$.next(this.saf.onFiltre(this._pageID, 'renouvellementdate', 'date', 'GE', this._now, this._licences));
        this._processedLicences$.next(this.saf.onFiltre(this._pageID, 'renouvellementdate', 'date', 'LE', this._date, this._licences));
        break;
      case this.filtresDate[0].options[2]:
        this._date.setDate(this._now.getDate() + 30);
        this._processedLicences$.next(this.saf.onFiltre(this._pageID, 'renouvellementdate', 'date', 'GE', this._now, this._licences));
        this._processedLicences$.next(this.saf.onFiltre(this._pageID, 'renouvellementdate', 'date', 'LE', this._date, this._licences));
        break;
      case this.filtresDate[1].options[0]:
        this._date.setDate(this._now.getDate() - 15);
        this._processedLicences$.next(this.saf.onFiltre(this._pageID, 'renouvellementdate', 'date', 'LE', this._now, this._licences))
        this._processedLicences$.next(this.saf.onFiltre(this._pageID, 'renouvellementdate', 'date', 'GE', this._date, this._licences));
        break;
      case this.filtresDate[1].options[1]:
        this._date.setDate(this._now.getDate() - 30);
        this._processedLicences$.next(this.saf.onFiltre(this._pageID, 'renouvellementdate', 'date', 'LE', this._now, this._licences))
        this._processedLicences$.next(this.saf.onFiltre(this._pageID, 'renouvellementdate', 'date', 'GE', this._date, this._licences));
        break;
      case this.filtresDate[1].options[2]:
        this._date.setMonth(this._now.getMonth() - 3);
        this._processedLicences$.next(this.saf.onFiltre(this._pageID, 'renouvellementdate', 'date', 'LE', this._now, this._licences))
        this._processedLicences$.next(this.saf.onFiltre(this._pageID, 'renouvellementdate', 'date', 'GE', this._date, this._licences));
        break;
      default:
        this.saf.resetFiltre(this._pageID, 'renouvellementdateGE');
        this.saf.resetFiltre(this._pageID, 'renouvellementdateLE');
        this._processedLicences$.next(this.saf.filtrer(this._pageID, this._licences));
        break;
    }
  }

  onPriorite(event: boolean): void {
    this.prioritaire = event;
  }

  modifier(licence: Licence): void {
    this.produits = {a: CartItem.fromObject({produit: {marque: licence.produit.marque, gabarit: 'V'}, qte: 1})};
    this.licencePopup = licence;
    this.licenceNonTrouvee(licence);
    // Le reste de la logique...
  }

  licenceNonTrouvee(licence: Licence): void {
    const ready = new Subject<void>();
    this.produitsSimilaires = [];
    ready.pipe(skip(1), take(1)).subscribe(() => this.showHelpPopup = true);
    this.produitService.getProduits(
      new CataloguePosition(licence.niv1, licence.niv2, licence.niv3),
      licence.produit.marque == 'ESET' ? licence.produit.reference.substr(0, 3) : '',
      licence.produit.marque).subscribe(produits => {
      if (produits[0]?.marque != null) {
        this.produitsSimilaires = produits;
      }
      this.showHelpPopup = true
      ready.next();
    });
    this.produitService.getProduitById(licence.produit.reference).subscribe(produit => {
      this.produitHelpPopup = produit;
      ready.next();
    });
  }

  hideHelpPopup(): void {
    this.produitHelpPopup = null;
    this.showHelpPopup = false;
    this.licencePopup = null;
    this.isAskingForHelp = false;
    this.demandeAideEnvoyee = false;
    this.commentaire = '';
  }

  queryProduitsSimilaires(): any {
    const res = {
      marque: this.licencePopup.produit.marque,
      niv1: this.licencePopup.niv1,
      niv2: this.licencePopup.niv2,
      niv3: this.licencePopup.niv3
    };
    return res;
  }

  afficherPopup(licence: Licence): void {
    this.clientPopup = Client.fromObject(licence.client);
    this.produits = {a: CartItem.fromObject({produit: {marque: licence.produit.marque, gabarit: 'V'}, qte: 1})};
    this.licencePopup = licence;
    this.showPopup = true;
  }

  onChangeClient(client: Client): void {
    this.clientPopup = Client.fromObject(client);
  }

  changeClient(client: Client): void {
    this.licencePopup.client = client;
    this.licencePopup.serie = client.serie;
    this.showPopup = false;
    this.licenceService.postEnduser(client, this.licencePopup.commande.numcommande).subscribe(() => this.licenceService.majEnduser().subscribe());
  }

  getCountryFromCode(code = 'fr'): Observable<any> {
    return this.adresseService.getCountryFromCode(code);
  }

  demandeAide(): void {
    this.licenceService.demandeAide(this.licencePopup, this.commentaire).pipe(take(1)).subscribe(() => this.demandeAideEnvoyee = true);
  }

  onClickReference(ref: string): void {
    this.produitService.getProduitById(ref).pipe(take(1), takeUntil(this._destroy$)).subscribe(produit => {
      if (produit.marque) {
        this.router.navigate(this.produitService.lienProduit(produit));
      }
    });
  }

  printDuree(nbJours: number): string {
    const years = Math.floor(nbJours / 365);
    const months = Math.floor(nbJours % 365 / 30);
    const days = Math.floor(nbJours % 365 % 30);
    if (years > 0) {
      if (months > 0) {
        return years + (years > 1 ? ' ans' : ' an') + ' et ' + months + ' mois ' + (years > 1 ? 'restants' : 'restant');
      } else {
        return years + ' ' + (years > 1 ? 'ans restants' : 'an restant');
      }
    } else {
      if (months > 0) {
        if (days > 0) {
          return months + ' mois et ' + days + (days > 1 ? ' jours' : ' jour') + ' ' + (months > 1 ? 'restants' : 'restant');
        } else {
          return months + ' ' + (months > 1 ? 'restants' : 'restant');
        }
      } else {
        if (days > 0) {
          return days + ' ' + (days > 1 ? 'jours restants' : 'jour restant');
        } else {
          return '';
        }
      }
    }
  }

  onPaginatorEvent(e: PageEvent): void {
    this.paginator.pageIndex = e.pageIndex;
    this.paginator.low = e.pageIndex * e.pageSize;
    this.paginator.high = this.paginator.low + e.pageSize;
    this.paginator.pageSize = e.pageSize;
    this.paginator.previousPageIndex = e.previousPageIndex;
  }

  linkToProduct(produitId: string) {
    this.produitService.getProduitById(produitId)
      .pipe(take(1))
      .subscribe(
        (ret) => {
          this.router.navigateByUrl(
            String(this.produitService.lienProduit(ret))
              .replace(/,/g, "/")
          );
        }
      );
  }
}
