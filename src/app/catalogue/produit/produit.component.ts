import {AfterContentInit, Component, OnInit, ViewChild} from "@angular/core";
import {
  AuthenticationService,
  CartService,
  ComponentsInteractionService,
  CotationService,
  WindowService
} from "@/_core/_services";
import {Produit} from "@/_util/models/produit";
import {Cotation} from "@/_util/models/cotation";
import {environment} from "@env";
import {User} from "@/_util/models";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Fiche, ProduitDetailService} from "@services/produit-detail.service";
import {LoadingService} from "@services/loading.service";
import {UntypedFormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {MatTabGroup} from "@angular/material/tabs";
import { ProduitService } from "@core/_services/produit.service";
import { window } from "rxjs";
import { url } from "node:inspector";

@Component({
  selector: "app-produit",
  templateUrl: "./produit.component.html",
  styleUrls: ["./produit.component.scss"],
  animations: [
    trigger("expandVertical", [
      state("open", style({ height: "*"})),
      state("closed", style({ height: "0" })),
      transition("open => closed", animate("300ms ease-in-out")),
      transition("closed => open", animate("300ms ease-in-out")),
    ]),
  ],
  providers: [ProduitDetailService]
})
export class ProduitComponent implements OnInit {
  style: UntypedFormControl = new UntypedFormControl('magnifier');
  simpleProduitsAssocieVente = false;
  simpleProduitsRemplacementVente = false;
  formatProduitsAssocieVente = 'list';
  formatProduitsRemplacementVente = 'list';
  environment = environment;
  produit: Produit = new Produit();
  imgUrl: string = null;
  cotations: Cotation[] = null;
  activeCotation: Cotation = null;
  descriptionMap: Map<string, Array<string>> = new Map();
  produitsRemplacement: Produit[] = [];
  produitsSimilaire: Produit[] = [];
  produitsAssocies: Produit[] = [];
  qtePriceAppliedIndex: number;
  currentUser: User;
  isLoading = true;
  collapsedIdsArray: string[] = ['gille-tarif'];
  textToClipboard: string;
  cotationLa: Cotation;
  isContentLoaded = false;
  nbrPhotos: number ;
  produitsRenouvellement: Produit[] = [];

  fiches :Fiche[]= [];
  tabIndex = 0;
  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  constructor(
    public cartService: CartService,
    protected produitDetailService: ProduitDetailService,
    protected authService: AuthenticationService,
    public componentsInteractionService: ComponentsInteractionService,
    private loadingService: LoadingService,
    private windowService: WindowService,
    private router: Router,
    private produitService: ProduitService,
    private cotationService: CotationService
  ) {
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(d => {
      if (this.currentUser?.id !== d?.id) {
        this.currentUser = d;
        this.getProduit();
        this.cotationService.getProduitCotations(this.produit.reference).subscribe(cotations => {
          if (cotations.length > 0) {
            
            this.cotations = cotations;
           
            
          }
                  
        })
       
      }
    });


    this.textToClipboard = 'https://www.actn.fr' + this.router.url;

    if (!this.currentUser) {
      this.getProduit();
    }

   /*  this.loadingService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
      this.windowService.scrollTo(0, 0);
    }); */
    
  }
 

  getProduit(): void {
    this.produitDetailService.getProduit((
      produit,
      imgUrl,
      description,
      produitsRemplacement,
    //  produitsSimilaires,
    produitsAssocies,
      produitsRenouvellement,
      nbrPhotos,) => {
      this.produit = produit;
      this.imgUrl = imgUrl;
      this.descriptionMap = description;
      this.produitsRemplacement = produitsRemplacement;
   //   this.produitsSimilaire = produitsSimilaires;
   this.produitsAssocies = produitsAssocies;
   this.produitsRenouvellement = produitsRenouvellement;
      this.cotations ;
      this.nbrPhotos = nbrPhotos ;
      this.getQtePriceAppliedIndex();
      this.loadingService.stopLoading();
      this.windowService.scrollTo(0, 0);
      this.isLoading = false;
      setTimeout(() => {
        this.isContentLoaded = true;
      }, 100);
      this.loadProduitPdf();
      this.loadProduitsSimilaires();
    });
   
    
  }

  getQtePriceAppliedIndex(): void {
    this.qtePriceAppliedIndex = this.cartService.cart.items[this.produit.reference]?.priceByQtyAppliedIndex ?? 0;
  }

  jumpToAnchor(anchor: string): void {
    const element = document.getElementById(anchor);
    this.tabIndex = this.tabGroup._tabs.toArray().findIndex(tab => tab.textLabel === 'Produits de remplacement');
    if (element) {
      
      element.scrollIntoView({behavior: 'smooth'});
    }
  }
  loadProduitsSimilaires(): void {
    
    this.produitService.getProduitSimilaire(this.produit.reference,true).subscribe((produitsSimilaires) => {
      this.produitsSimilaire = produitsSimilaires;
    });
  }

  /**
   * Evenement de redimensionnement de la page
   */
  onResize(event): void {
    this.checkSize(event.target.innerWidth);
  }

  loadProduitPdf(): void {
    this.produitDetailService.getProduitPdf(this.produit.pdf).subscribe((fiches) => {
      this.fiches = fiches
      
      
    }) 
  }
  /**
   * Vérifie la taille en largeur de la page et modifie ses paramètre d'affichage en fonction
   */
  checkSize(width: number): void {
    if (width >= 1150) {
      this.simpleProduitsAssocieVente = false;
      this.formatProduitsAssocieVente = 'list';
    } else {
      this.simpleProduitsAssocieVente = true;
      this.formatProduitsAssocieVente = 'list';
      if (width < 768) {
        this.formatProduitsAssocieVente = 'grid';
      }
    }
  }

  /**
   * Change l'image affichée du produit
   * @param index Numero de l'image du produit à afficher
   */
  changePhoto(index: number): void {
    if (index === 0) {
      this.imgUrl = environment.photosUrl + this.produitDetailService.urlImage(this.produit);
    } else {
      this.imgUrl = environment.photosUrl + this.produitDetailService.urlImage(this.produit, index);
    }
  }

  /**
   * Ouvre ou ferme un élément.
   * @param event L'élément DOM déclencheur
   * @param id L'identifiant de l'élément
   */
  toggleCollapseDivById(event, id: string): void {
    if (!event.srcEvent) {
      if (this.collapsedIdsArray.includes(id)) {
        this.collapsedIdsArray.splice(this.collapsedIdsArray.indexOf(id), 1);
      } else {
        this.collapsedIdsArray.push(id);
      }
    }
  }
  /**
   * Change la cotation active du produit
   * @param event Nouvelle cotation du produit, null si on retire la cotation
   */
  changeActiveCotation(event: Cotation): void {
    this.activeCotation = event;
  }

  ajoutPanierCotation() {
    if (this.activeCotation) {
      return this.activeCotation;
    }
  }
}

