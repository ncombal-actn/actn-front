import { Component, OnInit } from '@angular/core';
import { CommandesService } from '@/_core/_services/commandes.service';
import { AuthenticationService } from '@/_core/_services';
import { ProduitService } from '@core/_services/produit.service';
import { CartService } from '@core/_services/cart.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { RmaService } from '@core/_services/rma.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { take } from 'rxjs/operators';
import {MatPaginator, PageEvent as PageEvent} from '@angular/material/paginator';
import {faFilePdf, faMinusCircle, faPlusCircle, faTruck} from "@fortawesome/free-solid-svg-icons";
import {PopupObjDisplayComponent} from "@/_util/components/popup-obj-display/popup-obj-display.component";
import {CommonModule} from "@angular/common";
import {TabSortComponent} from "@/_util/components/tab-sort/tab-sort.component";
import {MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    PopupObjDisplayComponent,
    TabSortComponent,
    MatFormField,
    MatLabel,
    MatPaginator,
    MatSelect
  ],
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.scss']
})
export class CommandesComponent implements OnInit {

  quant: number;
  /** Est-ce que la page charge encore ? */
  loading: boolean = true;
  /** Type de page de commande */
  page: string = '';

  commandes$/*: Observable<Commande[]>*/;
  // numClient = JSON.parse(localStorage.getItem('currentUser')).id;

  /** Valeurs des entetes de commandes */
  cmd;
  /** Tableau non filtré de toutes les commandes formatée en donnée parcourable dans des boucles d'affichage */
  untouchedFormatCmd = [];
  /** Tableau filtrés toutes les commandes formatée en donnée parcourable dans des boucles d'affichage*/
  formatCmd = [];
  /** Tableau des status de commandes
   * Array( NumeroDeLivraison => Status ) */
  statutCmd = [];

  /** Observable des détails de commandes */
  cmdDetail$ = null;
  /** Valeur des détails de commandes */
  cmdDetails;

  /** Observable des détails de commandes */
  cmdNumSerie$ = null;
  /** Valeur des détails de commandes */
  cmdNumSeries;

  numColi$ = null;
  numColis = [];
  cmdNumColis = [];
  sortedNumColis = new Map<string, any>();
  /** Est-ce qu'une popup est affichée ? */
  isPopUp = false;
  produitActif;
  produitsList;
  serieList = [];
  valid = false;
  listOK = false;

  /** Liste des commandes déroulées / à afficher */
  display = [];
  /** Ligne de texte d'aide pour produit non valide
   * Récupérée depuis un fichier texte distant */
  aideProduitNonValide: string;
  /** Texte d'explication de l'indisponibilité de la facture */
  explicationPDFFactureindispo = "Le fichier PDF associé à cette facture est momentanément indisponible.";
  /** Texte d'explication de l'indisponibilité du BL */
  explicationPDFBLindispo = "Le fichier PDF associé à ce bon de livraison est momentanément indisponible.";

  selectedTri: [string, string] = ['', ''];
  filtres = new Map<string, string | Array<string>>();
  /** Set<string> des status de commandes */
  statutSet = new Set<string>();
  /** Set<string> des marques */
  protected marqueSet = new Set<string>();
  /** Tableau de toutes les marques de produits des commandes
   * Fait depuis 'marqueSet' */
  marqueArray: Array<string> = [];

  /** Target of the last search, security measure to prevent jumping over search fields */
  currentSearchTarget: string = "";
  /** The ID of the setTimeout of the current search, may already be over. */
  currentSearchId: any;
  /** Amount of milisecond to wait with no input to start a search */
  searchMiliDelay: number = 700;

  // MatPaginator Inputs
  /** Nombre d'éléments affichés par page */
  pageSize = 50;
  /** Options d'affichage de la page */
  pageSizeOptions: number[] = [30, 50, 100];
  /** Index de la page affichée */
  pageIndex = 0;

  // MatPaginator Output
  pageEvent: PageEvent;

  protected environment = environment;

  idClient: number;

  constructor(
    private http: HttpClient,
    private commandesService: CommandesService,
    private produitService: ProduitService,
    private rmaService: RmaService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void
  {
    this.idClient = this.authService.currentUser.id;

    setTimeout(() => {
      this.filtres.set('marque', []);


      if (this.route.snapshot.data.filDArianne[0].url === 'retours') {
        this.page = 'rma';
      } else {
        this.page = 'commande';
      }
      this.quant = 1;
      this.getServerData(null);
      this.rmaService.chargerAideProduitNonValide().subscribe(data => { this.aideProduitNonValide = data; });

      // COMMANDES ENTETES
      this.getCommandesEntetesRequest(() => {
        this.formatCommand();
      });

      // Serial Numbers
      this.numSerieRequest();
    },10)
  }

  getCommandesEntetesRequest = (callback) => {
    this.commandes$ = this.commandesService.getCommandes()
      .subscribe(
        (c) => {
          this.cmd = c;
          callback();
        },
        (error) => {
          console.warn('Erreur dans la requete PHP \'\' :', error);
        }
      );
  };
  formatCommand() {
    let i = 0;
    let buffer;

    while (this.cmd.length > 0) {
      // reset buffer
      buffer = [];

      // fill buffer with first element from cmd
      buffer.push(this.cmd.splice(0, 1)[0]);

      // search for other elements of the same command and push then in the buffer
      i = 0;
      while (i < this.cmd.length) {
        while ((i < this.cmd.length) && (this.cmd[i].numcommande == buffer[0].numcommande)) {
          buffer.push(this.cmd.splice(i, 1)[0]);
        }

        i++;
      }
      this.formatCmd.push(buffer);
      this.setStatutCommande(buffer);
    }
    this.untouchedFormatCmd = this.formatCmd;
    this.setDisplay();

    // COMMANDES DETAILS (slightly delayed to load the page faster)
    setTimeout(
      () => {
        this.cmdDetail$ = this.commandeDetailRequest().subscribe((ret) => {
          this.cmdDetails = ret;
          this.untouchedFormatCmd.forEach(commande => {
            commande.forEach(livraison => {
              this.statutSet.add(livraison.statut);
              this.getDetailsFromCommande(livraison.numcommande, livraison.numbl).forEach(details => {
                if (details['marque'] != "")
                {
                  this.marqueSet.add(details['marque']);
                }
              });
            });
          });
          this.marqueArray = Array.from(this.marqueSet).sort((a: any, b: any) => (a - b));
        });

        this.getNumColisRequest(() => {
          this.formatColis();
        });
      },
      0
    );
  }

  setDisplay() {
    for (let j = this.formatCmd.length - 1; j >= 0; j--) {
      this.display[String(this.formatCmd[j][0].numcommande)] = false;
    }
  }

  resetFilterMarque(filtreName: string ) {

    this.filtres.delete(filtreName);

    this.onSearch(filtreName, '');

  }

  numSerieRequest() {
    this.cmdNumSerie$ = this.http
      .get<any>(`${environment.apiUrl}/CommandesNumSerie.php`, {
        withCredentials: true,
        responseType: 'json'
      });
    this.cmdNumSerie$ = this.cmdNumSerie$.subscribe((ret) => {
      this.cmdNumSeries = ret;
    });
  }

  commandeDetailRequest() {
    return (
      this.http.get(`${environment.apiUrl}/CommandesDetail.php`, { withCredentials: true, responseType: 'json' })
    );
  }

  getNumColisRequest(callback) {
    /* Observable */
    this.numColi$ = this.http
      .get<any>(`${environment.apiUrl}/CommandesTrackingColis.php`, {
        withCredentials: true,
        responseType: 'json'

      });
    /* Subscribe */
    this.numColi$ = this.numColi$.subscribe((ret) => {
      /* Stockage des numéros de Colis */
      this.numColis = ret;

      /* FORMATAGE */
      callback();
    });
  }
  /** Vide this.numColis[] et le trie dans this.cmdNumColis[numcommande] */
  formatColis() {
    let i = 0;
    let j = 0;
    let buffer = [];
    let currentComparator;
    /* Tant que le tableau n'est pas vide */
    while (this.numColis.length > 0) {
      /* Set a comparator, parse the array and catch the corresponding entries in the buffer */
      currentComparator = this.numColis[0].commande;
      buffer = [];
      i = 0;
      while (i < this.numColis.length) {
        while ((i < this.numColis.length) && (this.numColis[i].commande == currentComparator)) {
          buffer.push(this.numColis.splice(i, 1));
        }
        i++;
      }
      /* Store the buffer in a new array at a corresponding index */
      this.cmdNumColis[String(currentComparator)] = buffer;
    }

    /* Pour toutes les cases de this.cmdNumColis[] */
    this.cmdNumColis.forEach((colis) => {
      let i = 0;
      let colisBuffer = [];
      let blBuffer = new Map<string, any>();
      let currentBl;
      let currentCmd = colis[0][0].commande;

      /* Tant qu'il reste des colis par commande */
      while (colis.length > 0) {

        i = 0;
        currentBl = colis[0][0].bl;
        colisBuffer = [];
        /* Parser tout les colis */
        while (i < colis.length) {
          /* Trier par le comparateur de BL */
          while ((i < colis.length) && (currentBl == colis[i][0].bl)) {
            colisBuffer.push(colis.splice(i, 1)[0][0]);
          }
          i++;
        }
        /* Stocker les colis par BL */
        blBuffer.set(currentBl.toString(), colisBuffer);
      }
      /* Stocker la liste des colis trié par BL dans une des cases par commande */
      this.sortedNumColis.set(currentCmd.toString(), blBuffer);
    });

    this.loadingOver();
  }


  livraisonSerials(livraison) {
    let ret = this.cmdNumSeries.filter((serial) => {
      return (serial.bp == livraison.numbp);
    });

    return (ret);
  }
  produitSerials(serials, produit) {
    let ret = serials.filter((serial) => {
      return (serial.produit == produit.produit);
    });

    return (ret);
  }

  unrollCommandDetails(commandes) {
    this.produitsList = this.rmaService.getProduitList();
    this.listOK = true;
    /* IF commande hidden */
    this.display[commandes[0].numcommande] = this.display[commandes[0].numcommande] == false;
  }
  setStatutCommande(livraisons) {
    let weight = null;
    let label = '';
    for (let i = livraisons.length - 1; i >= 0; i--) {
      if (livraisons[i].statutniveau == null || livraisons[i].statutniveau > weight) {
        weight = livraisons[i].statutniveau;
        label = livraisons[i].statut;
      }
    }
    this.statutCmd[livraisons[0].numcommande] = label;
  }

  /**
   * Set la couleur des lignes d'Avoir en noir
   */
  setColor(livraisons) {
    for (let i = livraisons.length - 1; i >= 0; i--) {
      if (livraisons[i].statut == "Avoir") {
        return ('rgba(145, 145, 145, 0.20)');
      }
    }
    return ('#fafafa');
    // return ('#32ADDA');
  }

  getDetailsFromCommande = (numcommande, numbl) => {
    return this.cmdDetails.filter(
      (entry) => {
        return ((entry.numcommande == numcommande) && (entry.numbl == numbl));
      }
    );
  }

  reOrderPreviousCommand(livraisons)
  {
    let produits: Array<any>;

    const commande: Array<{ prod: string, quantitecommande: number }> = [];

    livraisons.forEach(
      (livraison) =>
      {
        produits = this.cmdDetails.filter((entry) => { return ((entry.numcommande == livraison.numcommande) && (entry.numbl == livraison.numbl)); });

        produits.forEach(
          (produit) => commande.push(
            { prod: produit.produit, quantitecommande: produit.quantite }
          )
        );
      }
    );

    this.cartService.addSavedCart(commande);
  }

  parseInt(n) {
    return parseInt(n, 10);
  }

  loadingOver() {
    this.loading = false;
  }

  /**
   * Revois le lien de la fiche du produit à partir de sa/son seul(e) reference/ID :string
   */
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

  addProduitToCart(produit)
  {
    this.cartService.addSavedCart(
      [{
        prod: produit.produit,
        quantitecommande: 1
      }]
    );
  }

  popupDisplay(produit) {
    let tempList;
    this.serieList = [];
    this.valid = false;
    tempList = this.produitsList.filter(element => element.numcommande === produit.numcommande && element.numbl === produit.numbl && element.produit === produit.produit);
    if (tempList.length === 1) {
      this.isPopUp = true;
      this.produitActif = tempList[0];
      this.quant = this.produitActif.quantite;
      if (this.produitActif.quantite === '1' && this.isValid(this.produitActif)) {
        if (this.produitActif.noserie) {
          this.serieList.push(this.produitActif.noserie);
        }
        this.valid = true;
        this.selectProduit(this.produitActif);
      } else {
        if (this.route.snapshot.data.filDArianne[0].url === 'retours') {
          this.rmaService.isPopUp();
        }
      }
    }
  }

  isValid(produit: any): boolean {
    let tempList;
    let prod;
    tempList = this.produitsList.filter(element => element.numcommande === produit.numcommande && element.numbl === produit.numbl && element.produit === produit.produit);
    if (tempList.length === 1) {
      prod = tempList[0];
      return (prod.autorma === 'O');
    } else {
      return false;
    }
  }

  close() {
    this.isPopUp = false;
    this.serieList = [];
    this.valid = false;
    if (this.route.snapshot.data.filDArianne[0].url === 'retours') {
      this.rmaService.isNotPopUp();
    }
  }

  chargerAideProduitNonValide(): string {
    return this.aideProduitNonValide;
  }

  selectionSerie(serie) {
    if (this.serieList.includes(serie)) {
      const index = this.serieList.indexOf(serie);
      if (index > -1) {
        this.serieList.splice(index, 1);
        this.quant = 1;
        if (this.serieList.length === 0) {
          this.valid = false;
        } else {
          this.valid = true;
        }
      }
    } else {
      this.serieList.push(serie);
      this.quant = 1;
      this.valid = true;

    }
  }

  // vérifie que le produit peut être encore retourné
  valideRMA(produit: any): boolean {
    return (produit.autorma === 'O');
  }

  quantChange(event) {
    this.quant = parseInt(event);
  }

  selectProduit(produit, valid?) {
    if (valid) {
      this.valid = true;
    }
    if (this.valideRMA(produit)) {
      if (produit.quantite >= this.serieList.length && produit.quantite >= this.quant && this.valid) {
        this.rmaService.setProduit(produit, this.serieList, this.quant);
        this.rmaService.isNotPopUp();
        this.router.navigate(['/espace-client/confirmation-retour']);
      }
    } else {
      this.isPopUp = false;
      this.rmaService.isNotPopUp();
    }
  }

  selected(s: string): string {
    return this.selectedTri[0] === s ? this.selectedTri[1] : 'off';
  }

  /**
   * Déclenche le tri des éléments quand un des éléments du bandeau est cliqué.
   * @param s
   */
  onTri(s: string): void {
    if (s === this.selectedTri[0]) {
      switch (this.selectedTri[1]) {
        case 'off':
          this.selectedTri[1] = 'asc';
          break;
        case 'asc':
          this.selectedTri[1] = 'desc';
          break;
        case 'desc':
          this.selectedTri[1] = 'asc';
          break;
        default:
          this.selectedTri[1] = 'off';
          break;
      }
    } else {
      this.selectedTri[0] = s;
      this.selectedTri[1] = 'asc';
    }
    this.trierLivraisons(this.formatCmd);
  }

  /**
   * Trie les commandes selon l'état du bandeau.
   */
  trierLivraisons(livraisons: Array<any>): Array<any> {
    switch (this.selectedTri[0]) {
      case 'Réf. client':
        livraisons = this.tri(livraisons, 'referencecommande');
        break;
      case 'Réf. ACTN':
        livraisons = this.tri(livraisons, 'numcommande');
        break;
      case 'Date':
        livraisons = this.tri(livraisons, 'datecommande');
        break;
      case 'Factures':
        livraisons = this.tri(livraisons, 'numfacture');
        break;
      case 'Dates Fact.':
        livraisons = this.tri(livraisons, 'datefacture');
        break;
      case 'Statut':
        livraisons = this.tri(livraisons, 'statut');
        break;
    }
    this.formatCmd = livraisons;
    return livraisons;
  }

  /**
   * Tri les livraison selon un attribut
   * @param livraisons La liste des livraisons à trier
   * @param target L'attribut sur lequel on veut trier
   */
  tri(livraisons: Array<any>, target: string): Array<any> {
    if (livraisons.length <= 1) {
      return livraisons;
    }
    else if (typeof livraisons[0][0][target] === 'string') {
      switch (this.selectedTri[1]) {
        case 'asc':
          return livraisons.sort((l1, l2) => l1[0][target].localeCompare(l2[0][target]));
        case 'desc':
          return livraisons.sort((l1, l2) => -l1[0][target].localeCompare(l2[0][target]));
        case 'off':
          return livraisons;
      }
    } else {
      switch (this.selectedTri[1]) {
        case 'asc':
          return livraisons.sort((l1, l2) => l1[0][target].valueOf() === l2[0][target].valueOf() ? 0 : l1[0][target] > l2[0][target] ? 1 : -1);
        case 'desc':
          return livraisons.sort((l1, l2) => l1[0][target].valueOf() === l2[0][target].valueOf() ? 0 : l1[0][target] < l2[0][target] ? 1 : -1);
        case 'off':
          return livraisons;
      }
    }
  }

  arrayToUpper(arr: string | string[]): any
  {
    let typearr: string = typeof arr;
    if (typearr == "string") {
      return ((arr as string).toUpperCase());
    }
    if (typearr == "Array") {
      return ((arr as Array<string>).map(
        (elem) => {
          return (elem.toUpperCase());
        }
      ));
    }
    return null;
  }

  filtrerCommandes(): void {
    let commandes = this.untouchedFormatCmd;
    for (const target of this.filtres.keys()) { // pour chaque filtre
      commandes = commandes.filter((commande: Array<any>) => {
        let pass = false;
        for (const livraison of commande) { // avec chaque commande
          if (!pass && Object.keys(livraison).find(key => key === target) != null) {
            pass = this.filtres.get(target) != null ? this.arrayToUpper(livraison[target]).includes(this.arrayToUpper(this.filtres.get(target))) : true;
          } else {
            this.getDetailsFromCommande(livraison.numcommande, livraison.numbl).forEach(details => {
              if (target === 'marque') {
                if (this.filtres.get(target).length === 0) {
                  pass = true;
                } else {
                  for (const mark of this.filtres.get(target)) {
                    pass = pass || details[target].includes(mark);
                  }
                }
              } else {
                this.arrayToUpper(details[target]);
                if (!pass && this.arrayToUpper(details[target]).includes(this.arrayToUpper(this.filtres.get(target)))) {
                  pass = true;
                }
              }
            });
          }
        }
        return pass;
      });
    }
    this.formatCmd = commandes;
  }

  onSearch(target: string, event: string): void
  {
    if (this.currentSearchTarget == target)
    {
      clearTimeout(this.currentSearchId);
    }

    this.currentSearchTarget = target;
    this.currentSearchId = setTimeout(
      () =>
      {

        this.filtres.set(target, event);
        this.filtrerCommandes();
      },
      this.searchMiliDelay
    );
  }

  filtreMarqueToggle(marque: string): void {
    const filtreMarque = this.filtres.get('marque') as Array<string>;
    if (!!filtreMarque.includes(marque)) {
      filtreMarque.splice(filtreMarque.indexOf(marque), 1);
    } else {
      filtreMarque.push(marque);
    }
    this.filtrerCommandes();
  }

  getServerData(event?: PageEvent) {
    if (event) {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
    }
    return event;
  }



  protected readonly faFilePdf = faFilePdf;
  protected readonly faTruck = faTruck;
  protected readonly faPlusCircle = faPlusCircle;
  protected readonly faMinusCircle = faMinusCircle;
}
