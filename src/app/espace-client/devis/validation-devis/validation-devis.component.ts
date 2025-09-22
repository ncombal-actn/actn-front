import {ValidationPanierComponent} from '@/panier/validation-panier/validation-panier.component';
import {Adresse, CartItem, Client} from '@/_util/models';
import {Produit} from '@/_util/models/produit';
import {HttpClient} from '@angular/common/http';
import {AfterViewChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {
  AuthenticationService, CartService,
  ComponentsInteractionService,
  Devis,
  LicenceService,
  TempCartService,
  UserService,
  WindowService
} from '@core/_services';
import {ProduitService} from '@core/_services/produit.service';
import {RmaService} from '@core/_services/rma.service';
import {TransportService} from '@core/_services/transport.service';
import {BehaviorSubject} from 'rxjs';
import {filter, take, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-validation-devis',
  templateUrl: './validation-devis.component.html',
  styleUrls: ['./validation-devis.component.scss']
})
export class ValidationDevisComponent {

  public devis: Devis = null;
  public produits = new Array<CartItem>();
  tuerMoi: number
  private _ready$ = new BehaviorSubject<number>(0);

  constructor(
    public authService: AuthenticationService,
    public userService: UserService,
    public componentsInteractionService: ComponentsInteractionService,
    protected fb: FormBuilder,
    protected sr: DomSanitizer,
    protected http: HttpClient,
    protected rmaService: RmaService,
    protected licenceService: LicenceService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected transportService: TransportService,
    protected produitService: ProduitService,
    protected windows: WindowService,
    protected cartService: CartService,
  ) {
    //super(cartService, authService, componentsInteractionService, userService, fb, sr, http, rmaService, transportService, router, licenceService, windows, route,produitService);
    // Récupère le devis à valider
    /*if (history.state.devis) {
      this.devis = history.state.devis;
    } else {
      this.router.navigate(['espace-client', 'devis']);
      return;
    }
    this.txTVA = this.transportService.getTxTVA();
    this.fraisCcb = 0; // Initialize as needed
    this.grilleTrans = []; // Initialize as needed
    this.codeSchenkerTransport = ''; // Initialize as needed
    this.codeCorseTransport = ''; // Initialize as needed
    this.codeDefautTransport = ''; // Initialize as needed
    this.lockFormulaire = true;
    this.panierForm.setValue({
      ref: this.devis.referencecommande,
      email: this.devis.enduser.mail,
      transporteur: this.devis.transporteur,
      livraison: 'STD',
      paiement: '',
      adresse: this.devis.enduser.adresse1,
      dateexpedition: this.devis.datecommande,
      lawful: false
    })
    this.page = 'devisReglement';*/
  }

  /*public get ready(): number {
    return this._ready$.getValue();
  }

  public set ready(value: number) {
    this._ready$.next(value);
  }

  ngOnInit(): void {
    this.cartService.emptyCart();

    this.produitService.getProduitsById(this.devis.produits.reduce((acc: Array<string>, value) => acc.concat(value.prod), []))
      .pipe(take(1), takeUntil(this._destroy$))
      .subscribe(produits => {

        this.devis.produits.forEach(produit => {
          let unProduit = produits.find(p => p.reference === produit.prod);
          if (unProduit) {
            unProduit.prixD3E = produit.prixd3e;
            unProduit.prix = produit.prixnet;
          } else {
            unProduit = new Produit();
            unProduit.marque = produit.marque;
            unProduit.marquelib = produit.marquelib;
            unProduit.photo = produit.prod;
            unProduit.reference = produit.prod;
            unProduit.designation = produit.designation;
            unProduit.prix = produit.prixnet;
            unProduit.prixD3E = produit.prixd3e;
          }
          const cartItem = new CartItem();
          cartItem.produit = unProduit;
          cartItem.qte = produit.quantitecommande;
          this.produits.push(cartItem);
          this.cartService.addProduit(unProduit, produit.quantitecommande);
        });
        this.recalcul();
        this.ready++;
      });

    this.userService.getProfil().pipe(take(1), takeUntil(this._destroy$)).subscribe(data => {
      this.transportService.setTVA(data.user.TauxTVA);
      this.transportService.setMail(data.user.TIERSMEL);
      this.transportService.chargerGrille().subscribe(data => {
        this.transportService.grilleTrans = data;
        this.grilleTrans = this.transportService.getGrille();
        this.txTVA = this.transportService.getTxTVA();
        this.panierForm.controls['email'].setValue(this.transportService.getMail());
        this.ready++;
      });
    });

    this.user = this.authService.currentUser;

    this.cartService.setMinDate(this.panierForm);
    this._init();
    this.panierForm.controls['ref'].setValue(this.devis.numcommande + " " + this.devis.referencecommande);
    this.tuerMoi = this.transportService.getTxTVA();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _init(): void {
    this._ready$
      .pipe(filter(n => n === 2), take(1))
      .subscribe(
        () => {
          this.panierForm.controls['transporteur'].setValue(this.devis.transporteur);
          const adr = new Adresse();
          adr.adresse1 = this.devis.wadresse1;
          adr.adresse2 = this.devis.wadresse2;
          adr.codepostal = this.devis.wcodepostal;
          adr.nom = this.devis.wnom;
          adr.pays = this.devis.wpays;
          adr.phone = this.devis.wphone;
          adr.ville = this.devis.wville;
          this.panierForm.controls['adresse'].setValue(adr);


          if (adr.adresse1 != null) {
          }


          //  this.panierForm.value.livraison = adr ,
          this.fPanier = this.cartService.getFormatedCart()

          this.panierPort.totalMarchandiseht = this.devis.mthtcommande - this.devis.mtfraisdeport - this.devis.produits.reduce((acc, val) => acc += val.prixd3e * val.quantitecommande, 0);
          this.panierPort.totalht = this.devis.mthtcommande;
          this.panierPort.tva = this.devis.mthtcommande * this.user.TauxTVA;
          this.panierPort.ttc = this.devis.mtttccommande;
          this.panierPort.port = this.devis.mtfraisdeport;
          //this.panierPort.fraisCcb = this.logTaxe();
          this.userHasEscompte = this.authService.hasEscompte();

        }
      );

    this.tuerMoi = this.transportService.getTxTVA();

  }*/
}
