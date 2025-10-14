import {AfterViewInit, Component,  Input, OnDestroy, OnInit,  ViewChild} from "@angular/core";
import {distinctUntilChanged, forkJoin, Subject} from "rxjs";
import {debounceTime, take, takeUntil} from "rxjs/operators";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Adresse, CartItem, Client, Produit, User} from "@/_util/models";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

import {CartService} from "@/_core/_services/cart.service";
import {UserService} from "@/_core/_services/user.service";
import {AuthenticationService, LicenceService,} from "@/_core/_services";
import {WindowService} from "@/_core/_services/window/window.service";
import {ComponentsInteractionService} from "@/_core/_services/components-interaction.service";
import {environment} from "@env";
import {RmaService} from "@core/_services/rma.service";
import {TransportService} from "@core/_services/transport.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EnduserFormComponent} from "@/_util/components/enduser-form/enduser-form.component";
import {ProduitService} from "@services/produit.service";
import { FinanceService } from "@core/_services/finance.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '@/_util/components/snackbar/custom-snackbar.component';

/**
 * Page de validation du panier et redirection vers le module externe de paiement. En cours.
 */
@Component({
  selector: "app-validation-panier",
  templateUrl: "./validation-panier.component.html",
  styleUrls: ["./validation-panier.component.scss"],
})
export class ValidationPanierComponent implements OnInit, OnDestroy {
  /** Est-ce que la commande est un renouvellement de licence ? */
  @Input() renewLicence = false;
  @Input() lockCommande = false;
  @Input() lockFormulaire = false;
  /** Titre du panier, affiché en haut du composant */
  @Input() title = "Votre panier";

  /** Variable contenant un regroupement de variables d'environement vitales au site */
  environment = environment;

  /**
   * Valeurs renvoyée par la requete 'userService.getAdresses()'
   * Liste des adresses de l'Utilisateur
   *
   */
  adresses: Adresse[] = [];

  /** Détermine si la page est une page de validation de commande ou de devis */
  page: string;

  /** Est-ce que l'Utilisateur a un escompte ? */
  userHasEscompte: boolean = false;
  /** Est-ce qu'il y a une cotation active sur l'un des produits du panier ? */
  cartHasCotation: boolean = false;
  /** Est-ce que l'Utilisateur est étranger ? */
  userIsEtranger: boolean = false;

  /** Observable renvoyée par la requète de validation du panier */
  formRequest$ = null;
  /** Valeur renvoyée par la requète de validation du panier */
  formRequest;

  /* Frais de port / Retour de PanierPort.php */
  panierPort: any = {};

  /** Utilisateur connecté */
  user: User;

  /**IBAN ACTN */
  iban: string;
  /**BIC ACTN */
  bic: string;
  selectedOption;

  /** Code de type de payment
   * 'DEV' => Faire un devis */
  dev = "DEV";
  /** Code de type de payment
   * 'CDW' => Commander sur encours */
  cdw = "CDW";
  /** Code de type de payment
   * 'CCB' => Paiement par carte bancaire  */
  ccb = "CCB";
  vir = "VIR";
  /** Code de type de payment
   * 'WWW' => Recalcul */
  www = "WWW";
  /** Codes des grilles de transport
   * Grille par defaut */
  codeDefautTransport = "DFT";
  /** Codes des grilles de transport
   * Grille hors gabarit (SCHENKER) */
  codeSchenkerTransport = "H21";
  /** Codes des grilles de transport
   * Grille corse */
  codeCorseTransport = "FPC";

  /** Données formatées des produits du panier */
  fPanier;

  /** Le types de livraison est il autorisées ?
   * Livraison mail */
  livraisonEmail = false;
  /** Le types de livraison est il autorisées ?
   * Retrait en nos locaux */
  livraisonRetrait = false;
  /** Le types de livraison est il autorisées ?
   * Livraison chronopost */
  livraisonChronopost = false;
  /** Le types de livraison est il autorisées ?
   * Livraison schenker */
  livraisonSchenker = false;
  /** Le types de livraison est il autorisées ?
   * Livraison depuis le stock externe */
  livraisonDirecte: any;
  /** Est-ce que l'on a besoin de recalculer le prix du transport ? */
  needCotationTransport: boolean = false;
  dejaCharge = false;
  /** Grille des transport */
  grilleTrans: Array<any> = [];
  /** Taux de TVA */
  txTVA;
  mindate;
  /** Total hors taxe du panier */
  totalHt: number;
  /** Montant de la TVA du panier */
  ttc: number;
  /**Frai paiement cb */
  fraisCcb: number ;
  tvaEscompteCCB;
  /** Prevent from lauching multiple commands at once */
  awaitingCommandResponse = false;
  /** Autorise l'affichage d'une partie des messages d'erreurs */
  submitted = false;
  @ViewChild(EnduserFormComponent) enduserForm: EnduserFormComponent;
  newEnduser = new Client();
  enduser = new Client();
  /** Service de Panier */
  panierForm: FormGroup;
  devis: any = null;
  requestError = false;
  /** Observable de nettoyage, déclanchée à la destruction du composant */
  protected _destroy$ = new Subject<void>();
  taxeCcb: number;

  constructor(
    protected cartService: CartService,
    public authService: AuthenticationService,
    public componentsInteractionService: ComponentsInteractionService,
    protected userService: UserService,
    protected fb: FormBuilder,
    protected sr: DomSanitizer,
    protected http: HttpClient,
    protected rmaService: RmaService,
    protected transportService: TransportService,
    protected router: Router,
    protected licenceService: LicenceService,
    protected window: WindowService,
    protected route: ActivatedRoute,
    protected produitService: ProduitService,
    public financeService: FinanceService,
    private snackBar: MatSnackBar,

  ) {
    /** Formulaire de validation du panier */
    this.panierForm = this.fb.group({
      ref: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9 ]*$"),
          Validators.maxLength(25),
        ],
      ],
      email: [
        "",
        [Validators.required, Validators.email, Validators.maxLength(70)],
      ],
      transporteur: ["", [Validators.required]],
      livraison: ["STD", [Validators.required]],
      paiement: ["", [Validators.required]],
      adresse: ["", [Validators.required]],
      dateexpedition: [""],
      lawful: [false, [Validators.requiredTrue]],
    }, {validators: [this.cartService.dateValidator(), this.cartService.addressValidator()]});
  }

  /** Champs de produits, invisibles et destinés au module de paiement. */
  _refInputs = "";

  public get refInputs(): SafeHtml {
    return this.sr.bypassSecurityTrustHtml(this._refInputs);
  }

  /** Champs de produits, invisibles et destinés au module de paiement. */
  _marqueInputs = "";

  public get marqueInputs(): SafeHtml {
    return this.sr.bypassSecurityTrustHtml(this._marqueInputs);
  }

  /** Champs de produits, invisibles et destinés au module de paiement. */
  _qteInputs = "";

  public get qteInputs(): SafeHtml {
    return this.sr.bypassSecurityTrustHtml(this._qteInputs);
  }

  /** Champs de produits, invisibles et destinés au module de paiement. */
  _gabInputs = "";

  public get gabInputs(): SafeHtml {
    return this.sr.bypassSecurityTrustHtml(this._gabInputs);
  }

  commandeNonPayer: number ;

   ngOnInit(): void {
    this.user = this.authService.currentUser;




    if(this.user.BLOCAGE !== ""){
      this.snackBar.openFromComponent(CustomSnackbarComponent, {
        data: {
          message: `Certaines factures de votre compte client sont échues et non réglées.
                    <br> Consultez-les dans votre
                    <a href="https://www.actn.fr/actn/espace-client/finance" target="_blank">espace client</a>.
                    <br> Merci de régulariser rapidement pour éviter le blocage de vos commandes.`
        },
        duration: 300000,
        panelClass: ['snackbar-alert'],
      });
    }



    this.page = decodeURIComponent(
      this.route.snapshot.url[this.route.snapshot.url.length - 1].path
    );



    if (history.state.devis) {


      this.devis = history.state.devis;

      this.setCartDevisReglement();
    }else{
      this.recalcul()
      this._init();
    }

  }

  /** Destruction du ValidationPanierComponent */
  ngOnDestroy(): void {
    if (this.formRequest$ != null) {
      this.formRequest$.unsubscribe();
    }
    this._destroy$.next();
    this._destroy$.complete();
    this.cartService.emptyTempCart();
  }

  updateTVA(paysiso: string) {
    let txTVA = 0;
    if (paysiso == 'FR' || paysiso == '') {
      txTVA = 0.2;
    }
    this.transportService.setTVA(txTVA);
    this.recalcul();
  }

  isVirtualOnly(): boolean {
    for (const item of Object.values(this.cartService.cart.items)) {
      if (item.produit.gabarit !== 'V') {
        return false;
      }
    }
    return true;
  }

  canBought(): boolean {
    this.commandeNonPayer = this.financeService.getNbResultEchus();
    if (this.financeService.getNbResultEchus() > 0) {

      return  false;

    }else{
      return true;
    }
  }


  private _init() {
    this.cartHasCotation = this.cartService.hasCotation();
    this.userHasEscompte = this.authService.hasEscompte();
    this.transportService.chargerGrille().subscribe(data => {
      this.grilleTrans = data;
    });
    if (!this.txTVA) this.router.navigate(['/panier']);
    this.txTVA = this.user.TauxTVA;
    this.panierForm.controls["email"].setValue(this.transportService.getMail());

    this.fPanier = this.cartService.getFormatedCart();
    this.userIsEtranger = this.user.TIERSETRANGER == "O";

    const source = [this.cartService.getTaxes(), this.cartService.getBic(), this.cartService.getIban(), ];// this.cartService.getAdresses() j
    let tauxccb = Number(this.user.FraisCBmt);

    forkJoin(source).subscribe((data) => {
      this.taxeCcb = 1//Number(data[0]);
      ///this.panierPort.totalHt
      this.fraisCcb = Math.round(10 * tauxccb * 0.01 * 100) / 100;
      //this.fraisCcb = Math.round(this.panierPort.totalHt * (Number(this.user.FraisCBmt) * 0.01) * 100) / 100;//data[0] a la place de 1
      this.bic = data[1].toString();
      this.iban = data[2].toString();
     // this.adresses = data[3] as unknown as Adresse[];
    });

    this.cartService
    .getAdressesPanier(this.user.id)
    .pipe(takeUntil(this._destroy$))
    .subscribe((adresses) => {
      this.adresses = adresses;
    });


    this.cartService.setMinDate(this.panierForm);

    this.typesDeLivraisons();

    this.panierForm.controls["transporteur"].valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe((event) => {
        this.panierForm.controls["adresse"].setValue("");
        this.needCotationTransport = this.cartService.portCalculaator3000(this.panierForm, event);
        if (!this.lockFormulaire) {
          this.recalcul();
        }
      });

    this.panierForm.controls["adresse"].valueChanges
      .pipe(
        debounceTime(20),
        distinctUntilChanged(),
        takeUntil(this._destroy$)
      )
      .subscribe((event) => {
        this.needCotationTransport = this.cartService.portCalculaator3000(this.panierForm, event);
        if (!this.lockFormulaire) {
          this.recalcul();
        }
      });
    this.recalcul();
  }

  setCartDevisReglement() {
    this.panierForm.get('ref').setValue(this.devis.numcommande + ' ' + this.devis.referencecommande);
    this.panierForm.get('email').setValue(this.devis.enduser.mail);
    this.panierForm.get('transporteur').setValue(this.devis.transporteur);

    this.produitService.getProduitsById(this.devis.produits.reduce((acc: Array<string>, value) => acc.concat(value.prod), []))
      .pipe(take(1))
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
          this.cartService.addProduitTemporaire(unProduit, produit.quantitecommande, null); // Utiliser un panier temporaire
        });
        this._init();
      });
  }

  /**
   * Vérification de toutes les données de validation de la commande
   * Puis envois de la requete de commande s'il s'avère que tout est valide
   */
  submit(typeval: string): boolean {
    this.submitted = true;

    if (this.panierForm.get('transporteur').value === 'ENL' || this.panierForm.get('transporteur').value === 'MAI') {
      this.panierForm.get('adresse').setValue(' ');
    }

    if (!this.renewLicence && this.showClientFinal() && !this.enduserForm.valid) {
      return false;
    }
    this.panierForm.markAllAsTouched();
    if (this.panierForm.valid) {
      this.cartService.clientFinal = this.enduser;
      setTimeout(() => this.submitRequest(typeval));
      return true;
    }
    return false;
  }

  /**Paiement chrono + etranger */
  demandeCotationTransport(): void {
    this.panierForm.get('paiement')?.setValue('DEV');
  this.panierForm.get('port')?.setValue(999);
  this.submit('DEV');
  }

  /** Recalcule les fraits de port du panier celon ses produits son mode et son adresse de livraison */
  recalcul(): void {

    const cart = this.cartService.isUsingTempCart() ? this.cartService.getTempCart() : this.cartService.cart;


    const {nbHorsGab, totalD3E, nbVirtuel, nbStd, totPoids, allPoids} = this.cartService.getPoidsTotal();
    const totalMarchandiseHt = cart.total;
    const {transporteur, adresse} = this.panierForm.value;
    const codepostal = adresse?.codepostal || '';

    let portP = 0, franco = 0, fraisERP = 0, tva = 0;

   if (this.panierForm.value.livraison === "STD") {
      this.panierForm.value.adresse = "mail"
   }


    const typeEnvoi = this.cartService.determineTypeEnvoi(transporteur, nbHorsGab, nbVirtuel, nbStd, codepostal);
    const frais = this.cartService.determineFrais(typeEnvoi, transporteur, nbHorsGab, codepostal, this.codeSchenkerTransport, this.codeCorseTransport, this.codeDefautTransport);



    //const grilleFiltre = this.grilleTrans.find(({codefrais}) => codefrais === frais);
   const grillesFiltres = this.grilleTrans.filter(
  (element) => element.codefrais === frais
);
  let grilleFiltre = null;
  for (const grille of grillesFiltres) {
 if (totPoids <= +grille.kgmax && portP === 0) {
      grilleFiltre = grille;
        break; // Optimisation : Sort de la boucle dès que la condition est remplie
      }

  }

    // console.log(frais,'CAN YOU FEEL MY HEART',this.grilleTrans,"grilleFiltre", grilleFiltre,'typeenvoie',typeEnvoi ,' transporteur', transporteur, 'nbHorsGab', nbHorsGab, 'codepostal', codepostal);

    if (grilleFiltre) {
      ({
        portP,
        franco,
        fraisERP
      } = this.cartService.calculFrais(grilleFiltre, totPoids, portP, this.environment.maxFranco, typeEnvoi));
    }

    this.totalHt = portP + totalMarchandiseHt + totalD3E;
    this.txTVA = this.transportService.getTxTVA();
    this.fraisCcb = Math.round(this.totalHt * (this.taxeCcb * 0.01) * 100) / 100;
    if (this.panierForm.value.transporteur === 'TRA' ) {
     // tva = Math.round(this.totalHt  * 100) / 100;
      this.panierPort.tva = 0
    }else{

      tva = Math.round((this.totalHt * this.txTVA) * 100) / 100;
    }

    let {escompte, tvaEscompte, tvaEscompteCCB, escompteCB} = this.cartService.calculEscomptesEtTaxes(
      totalMarchandiseHt,
      totalD3E,
      portP,
      this.txTVA,
      +this.fraisCcb,
      +this.authService.currentUser.Pescompte
    );

    this.panierPort = {
      codeerp: fraisERP,
      typeenvoi: typeEnvoi,
      transporteur,
      port: portP,
      portfranco: franco,
      totalMarchandiseht: totalMarchandiseHt,
      Totald3e: totalD3E,
      totalht: this.totalHt,
      fraisBancaire: this.fraisCcb,
      tva,
      ttc: this.totalHt + tva,
      escompte,
      amountOfEscompte: escompte,
      totalEscompte: totalMarchandiseHt + totalD3E - escompte + portP + tvaEscompte,
      totalEscompteCB: Math.round((totalMarchandiseHt + totalD3E + this.fraisCcb + portP - escompte + tvaEscompteCCB) * 100) / 100,
      escompteCB,
      totalpoids: totPoids,
      allpoids: allPoids,
      tvaEscompte,
      tvaEscompteCCB,
      tauxTva: this.txTVA,
    };
  }

  /** Recalcul les frais de port quand lle mode de livraison change dans le formulaire */
  getPanierPortLivr(): void {
    if (!this.lockFormulaire) {
      this.recalcul();
    }
  }

  typesDeLivraisons(): void {
    const cart = this.cartService.isUsingTempCart() ? this.cartService.getTempCart() : this.cartService.cart;
    const gabarits = Object.values(cart.items).map(it => it.produit.gabarit);
    const livraisonType = this.cartService.determinerTypeDeLivraison(gabarits);



    const livraisonsInit = this.cartService.initialiserLivraisons();

    this.livraisonEmail = livraisonsInit.livraisonEmail;
    this.livraisonRetrait = livraisonsInit.livraisonRetrait;
    this.livraisonChronopost = livraisonsInit.livraisonChronopost;
    this.livraisonSchenker = livraisonsInit.livraisonSchenker;
    this.livraisonDirecte = livraisonsInit.livraisonDirecte;

    switch (livraisonType) {
      case 1:
        this.livraisonEmail = false;
        this.livraisonRetrait = true;
        this.livraisonChronopost = true;
        this.panierForm.value.transporteur = "CHR";
        break;
      case 2:
        this.livraisonChronopost = false;
        this.livraisonSchenker = true;
        this.livraisonRetrait = true;
        this.panierForm.value.transporteur = "SCH";
        break;
      default:
        this.livraisonEmail = true;
        this.panierForm.value.transporteur = "MAI";
        break;
    }

    const livraisonsDirectes = Object.values(cart.items).map(it => ({
      etat: it.produit.livraisondirecte,
      marque: it.produit.marque
    }));

    this.livraisonDirecte = this.evaluerConditions(livraisonsDirectes);

    this.getPanierPortLivr();
  }

  //Function pour savoir si on  peut livré en ldf ou si on passe en grisé ce référer à eric pour les idées à la con

 evaluerConditions(tableau: { etat: string, marque: string }[]): any {

 /* Sa fais passé toutes les livraisons en LDF mais aparament c'est plus ce qu'on veut vraiment la je suis fatigué
   if (tableau.length === 1 && !this.livraisonEmail) {
    return true;
  }
   */
  console.log(tableau);



  if (tableau.length >= 1) {
    const auMoinsUnLDF = tableau.some(item => item.etat == 'LDF');
    const toutesLesMarquesIdentiques = tableau.every((element) => element.marque === 'NITR'); //Pour l'instant on fais que nitram jusqua ce qua sa change pour x raison
console.log(toutesLesMarquesIdentiques);


    if (toutesLesMarquesIdentiques && this.panierPort.totalht >= 600) {
      return true;
    } else if (!auMoinsUnLDF ) {
      return false;
    } else {
      return "uncomplete";
    }
  }
  // Si tableau est vide (optionnel selon ton besoin)
  return "vide";
}


  /**
   * Renvoie s'il on doit ou pas afficher le formulaire de client final {boolean}
   * (Au moins un produit dans le panier est virtuel et sa marque figure dans la liste du service de licence)
   */
  showClientFinal(): boolean {
    for (const item of Object.values(this.cartService.cart.items)) {
      if (
        item.produit.gabarit == "V" &&
        this.licenceService.marques.has(item.produit.marque)
      ) {
        return true;
      }
    }
    return false;
  }

  copyText(textToCopy: string) {
    const selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = textToCopy;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
  }

  /**
   * Formatage de données puis envoi de la requète PHP validant la commande
   */
  protected submitRequest(typeval: string): void {

    this.awaitingCommandResponse = true;
this.panierForm.updateValueAndValidity();

    let submitAdress = this.cartService.buildAddress(this.panierForm.value.adresse);

    if (typeval === 'CCB' && !this.userHasEscompte) {
      this.panierPort.ttc =
        (this.panierPort.totalht + this.fraisCcb) * this.txTVA +
        (this.panierPort.totalht + this.fraisCcb);
    } else if (typeval === 'CCB' && this.userHasEscompte) {
      this.panierPort.ttc = this.panierPort.totalEscompteCB;
    } else if (typeval === 'VIR' || typeval === 'DEV') {
      this.panierPort.ttc = this.panierPort.totalEscompte;
    }

    const params = this.cartService.buildRequestParams(
      typeval,
      this.panierPort,
      this.panierForm,
      this.totalHt,
      this.fraisCcb,
      this.txTVA,
      submitAdress,
      this.user.id
    );


    this.formRequest$ = this.cartService.submitOrder(params).subscribe(
      (ret) => {
        this.formRequest = ret;
        if (this.formRequest[1].erreur === 'non') {
          this.cartService.setValideCommande(
            this.formRequest[1].ncde, //gros doute peut etre ncmd
            0,
            this.formRequest[1].transaction
          );
          if (this.formRequest[1].url.includes('ModeCB')) {
            this.window.open(
              this.formRequest[1].url,
              '_self',
             this.renewLicence ? "carttype='perm'" : "carttype='perm'"
            );
          } else {
            const data = this.cartService.getValidCommande();
            this.router.navigate([this.formRequest[1].url], {
              //  carttype: this.renewLicence ? 'temp' : 'perm',
              queryParams: {
                carttype: this.renewLicence ? 'perm' : 'perm',
                ncmd: data.ncmd,
                ticket: data.ticket,
                transaction: data.transaction,
              },
            });
          }
        }
        this.awaitingCommandResponse = false;
      },
      (error) => {
        this.requestError = true;
        this.awaitingCommandResponse = false;
        this.snackBar.open('Une erreur s\'est produite lors du traitement de la demande.', 'Close', {
          duration: 3000,
        });
      }
    );
  }
}
