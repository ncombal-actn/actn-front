import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  NgZone,
  ViewChildren,
  QueryList,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  inject,
  Renderer2,
} from "@angular/core";
import { environment } from "@env";
import { CatalogueService, WindowService, SAVService } from "@core/_services";
import { MarqueServiceService } from "@core/_services/marque-service.service";
import { first, take, takeUntil } from "rxjs/operators";
import { Subject, lastValueFrom } from "rxjs";
import { BreakpointObserver } from "@angular/cdk/layout";
import { BanniereComponent } from "@/banniere/banniere.component";
import {Router, RouterLink} from "@angular/router";
import {AsyncPipe, isPlatformBrowser, KeyValuePipe, NgClass} from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { SavPopupComponent } from '../sav-popup/sav-popup.component';
import {MatChipListbox} from "@angular/material/chips";
import {TitleWLineComponent} from "@/_util/components/title-w-line/title-w-line.component";
import {ImgFallbackDirective} from "@/_util/directives/img-fallback.directive";

@Component({
  selector: "app-nos-marques",
  standalone: true,
  imports: [
    TitleWLineComponent,
    MatChipListbox,
    NgClass,
    AsyncPipe,
    ImgFallbackDirective,
    RouterLink,
    BanniereComponent,
    KeyValuePipe
  ],
  templateUrl: "./nos-marques.component.html",
  styleUrls: ["./nos-marques.component.scss"],
})
export class NosMarquesComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly dialog = inject(MatDialog);

  @ViewChild("marqueSelected") marqueSelectedElement: ElementRef;
  @ViewChild('categoriesMarque') categories: ElementRef;

  @ViewChildren(BanniereComponent) bannieres: QueryList<BanniereComponent>;

  @ViewChild('categoriesMarqueShow', { static: false }) categoriesMarqueShow: ElementRef;

  /** Variable contenant un regroupement de variables d'environement vitales au site */
  environment = environment;
  /** Listes de toutes les marques récupérée */
  marques: Array<[string, string]>;

  /** Listes map de toutes les marques */
  private _marques = new Map<string, string>();
  /** Observable de nettoyage, déclanchée à la destruction du composant */
  private _destroy$ = new Subject<void>();
  private _loop = -1;
  private _timeout = -1;

  /** Tableau de toute les marques pour pouvoir revnir en arrière sur les filtre */
  fullMarques: Array<[string, string]>;

  /** Marque selectionnée */
  marquePicked = "";
  /**
   * Index de la marque selectionnée
   * initialisé à -1 quand aucune marque n'est selectionnée
   */
  indexMarquePicked = -1;
  /** Tableau "à étages" contenant les unes dans les autres, les catégories et sous catégories des marques
     * @example
     *  [{
            "marque": "DRAK",
            "marquelib": "DRAKA",
            "sub": [{
                "id": "CAB",
                "label": "Câblage",
                "photo": "60039572",
                "sub": [
                    { "id": "CBL",
                    "label": "Câbles",
                    "photo": "60039572" },
                    { "id": "FO",
                    "label": "Fibre Optique",
                    "photo": "60018767",
                    "sub": [{ "id": "CAB", "label": "Câbles FO", "photo": "60018767" }] }
                ]
            }]
        }, {}, {}, ...]
     */
  categoriesParMarques: [] = [];
  /** Nombre de case de marque par ligne */
  nbMarqueParLigne = 8;
  /** Nombre de colones de catégories et sous-catégories max */
  colonnesMax = 5;
  /** Liste des premières lettres de chaque marque
   * Utilisée ensuite pour créer une barre de sauts à chaques lettres */
  firstLetters: Map<string, string> = null;

  btnVoir = false;
  hideBtn = true;
  constructor(
      private catalogueService: CatalogueService,
      private breakpointObserver: BreakpointObserver,
      private ngZone: NgZone,
      private window: WindowService,
      private router: Router,
      public marqueService: MarqueServiceService,
      @Inject(PLATFORM_ID) private platformId: Object,
      @Inject(SAVService) public SAVservice: SAVService,
      private renderer: Renderer2

    ) {}

  /** Initialisation de NosMarquesComponent */
  async ngOnInit() {}

  /*function de rediction a appeler si l'url de la marque n'est pas vide  */
  redirect(url) {
    window.open(url, "_blank");
  }
  async setUpList() {
    const ret = await lastValueFrom(
      this.catalogueService.getCategoriesByMarques().pipe(take(1))
    );



    Object.values(ret).forEach((marque) => {
      if (marque["marque"]) {
        this._marques.set(marque["marquelib"], marque["marque"]);
      }
    });

    this.categoriesParMarques = ret;

    if (typeof window !== 'undefined') {
      await new Promise((resolve) => window.setTimeout(resolve, 30));
  }
    this.marques = Array.from(this._marques).sort((m1, m2) =>
      m1[0].localeCompare(m2[0])
    );

    let firstCharsSet: Map<string, string> = new Map<string, string>();
    this.marques.forEach((marque) => {
      if (marque[0] && !firstCharsSet.get(marque[0][0])) {
        firstCharsSet.set(marque[0][0], marque[0].replace(/\s/g, ""));
      }
    });

    this.firstLetters = firstCharsSet;
    this.fullMarques = this.marques;
if (!Array.isArray(this.marques)) {
  this.marques = Object.entries(this.marques);
}

    this.hideBtn = false;

    // You can call your function here
    setTimeout(() => {
      this.adjustCategoriesMarqueTop(this.marqueService.getIndexMarquePicked());
      this.marqueService.marquePicked$.pipe(first()).subscribe((data) => {
        if (data) {


          this.jumpToAnchor(data);
        }
      });
    }, 1000);
  }

  procedureSAV(marque:string){

    this.SAVservice.getProcedure(marque).subscribe((data) => {
      this.renderer.setStyle(document.body, 'height', 'auto');
      const dialogRef = this.dialog.open(SavPopupComponent,{
        data: { data},
        width: '600px',
      });
      dialogRef.afterClosed().subscribe(() => {
        // Restore height: 100% to body
        this.renderer.setStyle(document.body, 'height', '100%');
      });
    });
  }

  /** Destruction de NosMarquesComponent */
  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this.catalogueService.setFilArianne(true);
  }

  async ngAfterViewInit() {
    this.breakpointObserver
      .observe([
        "(min-width: 1650px)",
        "(min-width: 900px) and (max-width: 1300px)",
        "(max-width: 900px)",
      ])
      .pipe(takeUntil(this._destroy$))
      .subscribe((breakpoints) => {
        if (breakpoints.breakpoints["(min-width: 1650px)"]) {
          this.nbMarqueParLigne = 8;
          this.colonnesMax = 5;
        } else if (
          breakpoints.breakpoints["(min-width: 900px) and (max-width: 1300px)"]
        ) {
          this.nbMarqueParLigne = 6;
          this.colonnesMax = 3;
        } else if (breakpoints.breakpoints["(max-width: 900px)"]) {
          this.nbMarqueParLigne = 5;
          this.colonnesMax = 2;
        } else {
          this.nbMarqueParLigne = 7;
          this.colonnesMax = 4;
        }
        setTimeout(() => this.onResize());
      });

    this.catalogueService.setFilArianne(false);

    await this.setUpList();
  }

  /** Active/désactive la séléction d'une marque et ferme/ouvre ses catégories */
  toggleMarquePicked(marque: string, index: number): void {
    this.marqueService.marquePicked$.pipe(first()).subscribe((data) => {
      if (data === marque) {
        this.closeMarque();
      } else {
        this.closeMarque();
        this.marqueService.setMarquePicked(marque);
        this.marqueService.setIndexMarquePicked(index);
        window.setTimeout(() => this.adjustCategoriesMarqueTop(index));
      }
    });
  }


  /** Ferme les div des catégories des marques  */
  closeMarque(): void {
    window.clearInterval(this._loop);
    window.clearTimeout(this._timeout);
    const categories = document.querySelector(
      ".categoriesMarque.show"
    ) as HTMLElement;
    categories?.style.setProperty("max-height", `0px`);
    this.marqueService.setMarquePicked("");
    this.marqueService.setIndexMarquePicked(-1);
  }

  adjustCategoriesMarqueTop(index: number): void {
    if (isPlatformBrowser(this.platformId)) {

      this.ngZone.runOutsideAngular(() => {
        const marque = document.querySelector(".marqueSelected") as HTMLElement;
        const categories = document.querySelector(".categoriesMarque.show") as HTMLElement;

        if (!marque || !categories) return;


        const setMaxHeight = (element: HTMLElement, height: string) => {
          element.style.setProperty("max-height", height);
        };

        const setHeight = (element: HTMLElement, height: string) => {
          element.style.setProperty("height", height);
        };

        this.marqueService.marquePicked$
          .pipe(first())
          .subscribe((marquePicked) => {
            const foundBanniere = this.bannieres.find((banniere) =>
              banniere.marques.includes(marquePicked)
            );

            const maxHeight = `550px`;
            setMaxHeight(categories, maxHeight);

            const topValue = `${110 * (Math.floor(index / this.nbMarqueParLigne) + 1) + Math.floor(index / this.nbMarqueParLigne) * 20}px`;
            categories.style.setProperty("top", topValue);

            const updateMarqueHeight = () => {
              const newHeight = `${110 + categories.getClientRects()[0].height}px`;
              setMaxHeight(marque, newHeight);
              setHeight(marque, newHeight);
            };

            this._loop = window.setInterval(updateMarqueHeight);

            this._timeout = window.setTimeout(() => {
              window.clearInterval(this._loop);
              updateMarqueHeight();
              setMaxHeight(categories, `${categories.getClientRects()[0].height}px`);
            }, 400);
          });
      });
    }
  }

  /** Réajuste le DOM quand on resize la page */
  onResize(): void {
    this.ngZone.runOutsideAngular(() => {
      this.marqueService.indexMarquePicked$
        .pipe(first())
        .subscribe((indexMarquePicked) => {


          if (indexMarquePicked !== -1) {
            const categories = document.querySelector(
              ".categoriesMarque.show"
            ) as HTMLElement;
            categories.style.setProperty(
              "top",
              `${
                110 *
                  (Math.floor(indexMarquePicked / this.nbMarqueParLigne) + 1) +
                Math.floor(indexMarquePicked / this.nbMarqueParLigne) * 20
              }px`
            );
          }
        });
    });
  }

  /** Renvois l'index de la marque selectionnée
   * @param marqueStr Nom de la marque selectionnée
   * @returns Renvois l'index dans de la marque selectionnée
   */
  indexOfMarquePicked(marqueStr: string): number {
    const parseArr = Object.keys(this.categoriesParMarques);
    parseArr.splice(0, 1);
    for (let i = parseArr.length - 1; i >= 0; i--) {
      if (parseArr[i] == marqueStr) {
        return i;
      }
    }
    return -1;
  }

  /** Calcule un nombre de colonnes d'affichage pour une marque */
  getNbColonnesPourMarque(marque: string): string {
    const rec = (niveau, level) => {
      if (niveau.sub) {
        const s = Object.values(niveau.sub) as Array<any>;
        return (
          s.length * level +
          s.reduce((acc, cur) => acc + rec(cur, level - 1), 0)
        );
      } else {
        return 0;
      }
    };
    const nbColonnes = Math.ceil(
      rec(this.getCategoriesParMarques(marque), 3) / 18
    );
    return `${nbColonnes > this.colonnesMax ? this.colonnesMax : nbColonnes}`;
  }

  /**
   * @param marque Nom de la marque pour laquelle renvoyer ses catégories et sous-catégories
   */
  getCategoriesParMarques(marque: string): Array<unknown> {
    return this.categoriesParMarques[marque];
  }

  isPartenaire(marque: string): string {
    if (this.categoriesParMarques[marque] && this.categoriesParMarques[marque].urlprg ) {
      return this.categoriesParMarques[marque].urlprg;
    }else{

      return '';
    }
  }

  openLink(marque: string): void {
    const url = this.isPartenaire(marque);
    window.open(url, '_blank');
  }




  /**
   * Déplace la vue jusqu'à l'élément souhaité.
   * @param anchor Le nom de la vue vers laquelle se déplacer
   */
  jumpToAnchor(anchor: string): void {
    anchor = anchor.replace(/\s/g, "");
    this.window.scrollToElementWithOffset(`#${anchor}`, 45);
  }

  removeSpaces(str): string {
    return str.replace(/\s/g, "");
  }

  /** Affiche des infos utiles au debug */
  log() {
  }




normalizeStringForUrl(input: string): string {
  let normalized = input.normalize('NFD');
    normalized = normalized.replace(/[\u0300-\u036f]/g, '');
    normalized = normalized.replace(/\s+/g, '%20');
    normalized = normalized.replace(/[^a-zA-Z0-9%20]/g, '');
    return normalized;
}

  resetMarque() {
    this.btnVoir = false;
    this.marques = this.fullMarques;
  }

  removeMarque(letre: string) {
    this.resetMarque();

    let nLetre = letre.toUpperCase();
    let filtredArray = this.marques.filter((obj) => {
      return obj[0][0] === nLetre;
    });
    this.marques = filtredArray;
    this.btnVoir = true;
  }
}
