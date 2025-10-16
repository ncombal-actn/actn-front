import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '@/_util/models';

import {CartService} from '@/_core/_services/cart.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env';
import {ProduitService} from '@core/_services/produit.service';
import {take, takeLast} from 'rxjs/operators';
import {TransportService} from '@core/_services/transport.service';
import {RmaService} from '@core/_services/rma.service';
import {AuthenticationService} from '@core/_services';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {SnackbarService} from '@/_util/components/snackbar/snackbar.service';
import {Subject} from 'rxjs';
import {StepperComponent} from "@/panier/stepper/stepper.component";
import {LabelsPanierComponent} from "@/panier/labels-panier/labels-panier.component";
import {PanierRowComponent} from "@/panier/panier-row/panier-row.component";
import {CurrencyPipe, KeyValuePipe} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatIcon} from "@angular/material/icon";
import {PaniersEnregistresComponent} from "@/espace-client/paniers-enregistres/paniers-enregistres.component";

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [
    LabelsPanierComponent,
    PanierRowComponent,
    StepperComponent,
    KeyValuePipe,
    CurrencyPipe,
    MatProgressSpinner,
    MatIcon,
    PaniersEnregistresComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.scss']
})
export class PanierComponent implements OnInit, OnDestroy {
  /** Variable contenant un regroupement de variables d'environement vitales au site */
  environment = environment;
  /** Observable de ListePaniers.php */
  listePanier$ = null;
  /** Liste des paniers sauvegardés */
  listePanier;
  /** Est-ce que le composant est en train de sauvegarder un panier ?
   * Affiche le widget de chargement */
  savingCart = false;
  /** Est-ce que l'on affiche les panierSauvegardés ? */
  paniersDisplay = false;

  /**
   * Index du produit sur lequel afficher une confirmation de suppression.
   */
  showDeletePopUp = -1;

  /**
   * Possibilités de location
   * 0 : pas de produits louables
   * 1 : une partie des produits du panier sont louables
   * 2 : tout les produits du panier sont louables
   */
  locationState: 0 | 1 | 2 = 0;

  /** Tableau stockant la présence d'erreurs dans le panier */
  panierRowErrors: Array<boolean>;
  /** Est-ce que la validation du panier est désactivée ? */
  disableValidation = true;
  /** Utilisateur connecté */
  user: User = null;

  /** Observable de nettoyage, déclanchée à la destruction du composant */
  private _destroy$ = new Subject<void>();
  loadingCart = true;

  constructor(
    public cartService: CartService,
    private http: HttpClient,
    public produitService: ProduitService,
    private transportService: TransportService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private snackbarService: SnackbarService,
  ) {
  }

  /**
   * Initialisation de PanierComponent
   * - Récupère l'utilisateur
   * - Récupère les grilles de transport, le taux de TVA et le mail de l'utilisateur
   * - Actualise le panier
   * - Récupère la liste des paniers sauvegardés
   * - Vérifie la possibilité de louer le panier
   */

  ngOnInit() {
    this.user = this.authenticationService.currentUser;
    this.transportService.formatGrille();
    this.transportService.setTVA(this.user.TauxTVA);
    this.transportService.setMail(this.user.TIERSMEL);

    /* PANIERCALCUL.PHP */
    this.actualiserPanier();

    /* GET LISTE DES PANIERS SAUVEGARDÉS */
    this.getSavedPaniers();

    this.panierRowErrors = new Array(this.cartService.qteProduits);
    this.panierRowErrors.fill(false);
    this.loadingCart = false;
  }

  /** Destruction de PanierComponent */
  ngOnDestroy() {
    if (this.listePanier$ != null) {
      this.listePanier$.unsubscribe();
    }

    this._destroy$.next();
    this._destroy$.complete();
    setTimeout(() => this.snackbarService.hideSnackbar(), 5000);
  }

  /** Actualise le panier et en vérifie les données
   * Désactive la validation le temps de vérifier */
  actualiserPanier() {
    this.disableValidation = true;
    setTimeout(() => {

    }, 100)
    /* recupérer les éléments du panier et les formater pour la requette */
    const cartSave = Object.values(this.cartService.cart.items).map(
      (item: any) => {
        return ({
          marque: item.produit.marque,
          quantite: item.qte,
          reference: item.produit.reference,
          // cotation: item.cotation.numcotation,
          // cotationLigne: item.cotation.numcotationLigne
        });
      }
    );

    const rf = cartSave.map((sc) => (sc.reference));
    const qt = cartSave.map((sc) => (sc.quantite));
    // const cot = cartSave.map((sc) => (sc.cotation));
    /* Requette 'PanierCalcul.php' */
    if (rf.length > 0) {
      this.http.post<any>(`${environment.apiUrl}/PanierCalcul.php`,
        {ref: rf},
        {withCredentials: true, responseType: 'json'}
      ).pipe(take(1))
        .subscribe({
          next: (ret) => {
            this.updateCart(this.cartService.formSavedProducts(ret), qt);
            this.loadingCart = false;
          },
          error: (data) => {
            console.log('data', data);
            this.authenticationService.logout();
            this.router.navigate(['/login'], {
              queryParams: {returnUrl: 'panier'},
              state: {error: true}
            });
          }
        });
    } else {
      this.disableValidation = false;
    }
  }

  /**
   * Mets à jour le panier avec de nouvelles informations plus récentes
   * @param products Liste de Produits aux informations mises à jour
   * @param quantities Liste de quantités des produits dans 'products'
   */
  updateCart(products, quantities: number[]): void {
    // Cherche les items retirés du panier
    const deletedItems = [];
    Object.keys(this.cartService.cart.items).forEach(item => {
      const produit = products.find(product => product.reference === item);
      if (produit == null) {
        deletedItems.push(item);
        this.cartService.removeProduit(this.cartService.cart.items[item].produit);
      }
    });
    if (deletedItems.length > 0) {
      const params = {
        noTimer: true,
        warning: true,
        large: true
      };
      if (deletedItems.length > 1) {
        this.snackbarService.showSnackbar(`Les produits ${deletedItems.join(', ')} ne sont plus proposés à la vente et ont été retirés de votre panier.`, '', () => {
        }, 0, params);
      } else {
        this.snackbarService.showSnackbar(`Le produit ${deletedItems[0]} n'est plus proposé à la vente et a été retiré de votre panier.`, '', () => {
        }, 0, params);
      }
    }
    for (let i = 0; i < products.length; i++) {
      this.cartService.realyUpdateProduit(products[i], quantities[i]);
    }
    this.disableValidation = false;
  }

  /**
   * Sauvegarder le panier actuel
   */
  sauvegarderLePanier(): void {
    this.savingCart = true;
    const cartSave = Object.values(this.cartService.cart.items).map(
      (item: any) => {
        return (
          {
            marque: item.produit.marque,
            quantite: item.qte,
            reference: item.produit.reference
          }
        );
      }
    );

    let ret = '';

    this.cartService.sauvegarderLePanierRequest(cartSave)
      .pipe(takeLast(1))
      .subscribe(
        (data) => {
          ret = data;
          this.getSavedPaniers();
          this.savingCart = false;
        },
        (error) => {
          this.savingCart = false;
        }
      );
  }

  /**
   * Récupère les paniers sauvegardés du client
   */
  getSavedPaniers() {
    if (this.listePanier$ != null) {
      this.listePanier$.unsubscribe();
    }
    /* GET LISTE DES PANIERS SAUVEGARDÉS */
    this.listePanier$ = this.http
      .get(`${environment.apiUrl}/ListePaniers.php`, {
        withCredentials: true,
        responseType: 'json'
      })
      .subscribe(
        (ret) => {
          // this.listePanier = ret;
          this.listePanier = this.groupByArray(ret, 'numcommande');
        }
      );
  }

  /** Afficher les paniers sauvegardés */
  afficherPaniers() {
    this.paniersDisplay = true;
  }

  /** Cacher les paniers sauvegardés */
  hidePaniers() {
    this.paniersDisplay = false;
  }

  /** Afficher/Cacher les paniers sauvegardés */
  togglePaniers() {
    if (this.paniersDisplay) {
      this.paniersDisplay = false;
    } else {
      this.paniersDisplay = true;
    }
  }

  /* myfunctions */
  groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  groupByArray = function (xs, key) {
    return xs.reduce(function (rv, x) {
      const v = key instanceof Function ? key(x) : x[key];
      const el = rv.find((r) => r && r.key === v);
      if (el) {
        el.values.push(x);
      } else {
        rv.push({key: v, values: [x]});
      }
      return rv;
    }, []);
  };

  /** Formate la date d'aujourd'hui en une string et la renvoie */
  getCurrentDateInString = () => {
    /* SET DATE INPUT */
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    let minday;
    let minmonth;
    if (dd < 10) {
      minday = '0' + dd;
    } else {
      minday = dd;
    }
    if (mm < 10) {
      minmonth = '0' + mm;
    } else {
      minmonth = mm;
    }

    const mindate = yyyy + '-' + minmonth + '-' + minday;
    return (mindate);
  };

  /** Fonction de debug
   * Affiche des informations clefs dans la console du navigateur */
  log() {
  }

  /** Applique la valeur booleene donnée à l'index donnée de la liste d'erreur des lignes du panier 'this.panierRowErrors'
   * @param i Index de 'this.panierRowErrors' à modifier
   * @param value Nouvelle valeur à entrer dans 'this.panierRowErrors[i]''
   */
  panierRowError(i: number, value: boolean) {
    this.panierRowErrors[i] = value;
  }

  /** Répond à : Est-ce qu'il y a une erreur dans une des lignes du panier ? */
  isErrorInPanier(): boolean {
    return this.panierRowErrors.some(p => p);
  }

}
