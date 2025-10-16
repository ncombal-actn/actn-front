import {Injectable, Injector, OnDestroy} from '@angular/core';
import {Adresse, Cart, CartItem, Client, Cotation, Produit} from '@/_util/models';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import { environment } from '@env';
import { LicenceService } from './licence.service';
import { AuthenticationService } from './authentication.service';
import {Description} from "@/_util/models/Description";
import {LocalStorageService} from "@services/localStorage/local-storage.service";
import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnDestroy{
  type: string = "base";
  qteProduits: number;
  subscriptionToCurrentUser: Subscription = null;
  protected valideCommande: { ncmd: number, ticket: string, transaction: string };
  protected _client = new BehaviorSubject<Client>(null);
  protected _cart: BehaviorSubject<Cart> = new BehaviorSubject<Cart>(new Cart());
  loading = new Subject<boolean>();
  userIsStranger: boolean = false;
  private tempCart: Cart = new Cart();
  private usingTempCart: boolean = false;

  /** Lazy injection pour LicenceService et AuthenticationService */
  private _licenceService: any = null;
  private _authService: any = null;

  private get licenceService() {
    if (!this._licenceService) this._licenceService = this.injector.get<any>(LicenceService);
    return this._licenceService;
  }

  private get authService() {
    if (!this._authService) this._authService = this.injector.get<any>(AuthenticationService);
    return this._authService;
  }

  constructor(
    protected httpClient: HttpClient,
    protected localStorage: LocalStorageService,
    protected injector: Injector
  ) {}

  get cart(): Cart {
    return this._cart.value;
  }


  get cart$(): Observable<Cart> {
    return this._cart.asObservable();
  }


  get loading$(): Observable<boolean> {
    return this.loading.asObservable();
  }

  get clientFinal(): Client {
    return this._client.value;
  }

  set clientFinal(client: Client) {
    this._client.next(client);
    this.licenceService.postEnduser(client).subscribe();
  }

  get clientFinal$(): Observable<Client> {
    return this._client.asObservable();
  }

  ngOnDestroy() {
    this.subscriptionToCurrentUser?.unsubscribe();
  }

  public addProduit(produit: Produit, qte: number, cotation: Cotation = null, desc?: Description): void {
    if (this.cart.items[produit.reference]) {
      if (cotation) this.cart.items[produit.reference].cotation = cotation;
      this.updateProduit(produit, qte);
    } else if (qte > 0) {
      const item = new CartItem();
      item.produit = produit;
      item.cotation = cotation;
      item.desc = desc;
      this.cart.items[produit.reference] = item;
      this.updateQuantiteProduit(produit, (produit.codePromo === 'D' || produit.codePromo === 'K')  && qte > produit.qteStock1 ? produit.qteStock1 : qte);
      this.updateCart();
    }
  }

  addProduitTemporaire(produit: Produit, quantite: number, cotation: Cotation = null, desc?: Description): void {
    const cartItem = new CartItem();
    cartItem.produit = produit;
    cartItem.qte = quantite;
    cartItem.cotation = cotation;
    cartItem.desc = desc;
    this.tempCart.items[produit.reference] = cartItem;
    this.usingTempCart = true;
  }

  isUsingTempCart(): boolean {
    return this.usingTempCart;
  }

  emptyTempCart(): void {
    this.tempCart = new Cart();
    this.usingTempCart = false;
  }

  getTempCart(): Cart {
    return this.tempCart;
  }

  public updateProduit(produit: Produit, qte: number): void {
    if (qte >= 0 || this.cart.items[produit.reference].qte > Math.abs(qte)) {
      const newQte = ( produit.codePromo === 'D' || produit.codePromo === 'K'  )&& this.cart.items[produit.reference].qte + qte > produit.qteStock1
        ? produit.qteStock1
        : this.cart.items[produit.reference].qte + qte;
      this.updateQuantiteProduit(produit, newQte);
      this.updateCart();
    } else {
      this.removeProduit(produit);
    }
  }

 /*  public realyUpdateProduit(produit: Produit, qte: number, cotation: Cotation = null): void {

    if (this.cart.items[produit.reference]) {
      if (qte > 0) {
        Object.assign(this.cart.items[produit.reference].produit, produit);
        this.updateQuantiteProduit(this.cart.items[produit.reference].produit, qte);
      } else {
        this.removeProduit(produit);
      }
    }
  } */
 public realyUpdateProduit(produit: Produit, qte: number, cotation: Cotation = null): void {
  const ref = produit.reference;

  if (this.cart.items[ref]) {
    if (qte > 0) {
      const oldProduit = this.cart.items[ref].produit;
      const mergedProduit = this.mergeProduitData(oldProduit, produit);

      this.cart.items[ref].produit = mergedProduit;
      this.updateQuantiteProduit(mergedProduit, qte);
    } else {
      this.removeProduit(produit);
    }
  }
}


  public updateQuantiteProduit(produit: Produit, quantite: number): void {
    if (quantite >= 0) {
      this.cart.items[produit.reference].qte = quantite;
      this.updateCart();
    } else {
      this.removeProduit(produit);
    }
  }

  public removeProduit(produit: Produit): void {
    delete this.cart.items[produit.reference];
    this.updateCart();
  }

  private mergeProduitData(oldProduit: Produit, newProduit: Partial<Produit>): any {
  return {
    ...oldProduit,
    ...newProduit,
    qtePrice: oldProduit.qtePrice ?? newProduit.qtePrice,
    hasPriceByQte: oldProduit.hasPriceByQte ?? newProduit.hasPriceByQte,
    pdfs: oldProduit.pdfs ?? newProduit.pdfs,
    // Ajoute ici d’autres propriétés que l’API oublie de renvoyer
  };
}

  public emptyCart(): void {
    /*const currentUserId = this.authService.currentUser?.id?.toString();
    if (currentUserId) this.cookieService.delete(`cart_${currentUserId}`, '/');
    Object.keys(this.cart.items).forEach(key => this.removeProduit(this.cart.items[key].produit));*/
    for (const key of Object.keys(this.cart.items)) {
      this.removeProduit(this.cart.items[key].produit);
    }
  }

  setValideCommande(numcmd, tick, transac): void {
    this.valideCommande = { ncmd: numcmd, ticket: tick, transaction: transac };
  }

  eraseValidCommande(): void {
    this.valideCommande = null;
  }

  getValidCommande(): { ncmd: number, ticket: string, transaction: string } {
    return this.valideCommande;
  }

  updateCart(): void {
    /*const currentUserId = this.authService.currentUser?.id?.toString();
    if (currentUserId) {
      this._cart.next(this.cart);
      this.qteProduits = this.cart.qteProduits;
      const minimalCart = Object.keys(this.cart.items).map(key => ({
        reference: this.cart.items[key].produit.reference,
        qte: this.cart.items[key].qte
      }));
      this.cookieService.set(`cart_${currentUserId}`, JSON.stringify(minimalCart), 7, '/');
    }*/

    this._cart.next(this.cart);
    this.qteProduits = this.cart.qteProduits;

    this.localStorage.setItem('cart', JSON.stringify(this.cart.toJSON()));
  }

  getIban() {
    return this.httpClient.get(`${environment.apiUrl}/iban.txt`, {
      responseType: 'text',
      withCredentials: true
    });
  }

  getBic() {
    return this.httpClient.get(`${environment.apiUrl}/bic.txt`, {
      responseType: 'text',
      withCredentials: true
    });
  }

  getTaxes() {
    return this.httpClient
      .get<number>(`${environment.apiUrl}/fraisCcb.php`, {
        withCredentials: true,

      });

  }

  getAdresses(){
    return this.httpClient.get<Array<Adresse>>(`${environment.apiUrl}/ListeAdresses.php`,{
      withCredentials: true,
      responseType: 'json'
    });
  }

  //Bon alors dans panier on arrive pas à récup id du client avec le cookies. sa marche en prod mais aps en local alors on avs juste faire sa
  getAdressesPanier(id:any){
    return this.httpClient.get<Array<Adresse>>(`${environment.apiUrl}/ListeAdresses.php`,{
      withCredentials: true,
      responseType: 'json',
      params: { id: id}
    });

  }

   static fromObject(obj: any): Cart {
    const cart = new Cart();
    cart.items = (obj.items ?? []).map((item: any) => CartItem.fromObject(item));
    return cart;
  }



  public getQteProduit(produit: Produit): number {
    return this.cart.items[produit?.reference]?.qte || 0;
  }

  sauvegarderLePanierRequest(saveCart): Observable<any> {
    const mq = JSON.stringify(saveCart.map(sc => sc.marque));
    const qt = JSON.stringify(saveCart.map(sc => sc.quantite));
    const rf = JSON.stringify(saveCart.map(sc => encodeURIComponent(sc.reference)));
    return this.httpClient.get<any>(`${environment.apiUrl}/Sauvepanier.php`, {
      withCredentials: true,
      params: { marque: mq, qte: qt, ref: rf}
    });
  }

  addSavedCart(addingCart): void {
    const rf = addingCart.map(pd => pd.prod);
    this.httpClient.post<any>(`${environment.apiUrl}/PanierCalcul.php`, { ref: rf }, {
      withCredentials: true,
      responseType: 'json',
    }).subscribe(ret => {
      this.addSavedProducts(this.formSavedProducts(ret), addingCart.map(pd => Number(pd.quantitecommande)));
    });
  }

  formSavedProducts(sCart): Array<Produit> {
    return sCart.map(product => Object.assign(new Produit(), product));
  }

  public addSavedProducts(products, quantities): void {
    products.forEach((product, i) => this.addProduit(product, quantities[i]));
  }

  public changeCotation(cotation: Cotation, referenceProduit: string): void {
    if (this.cart.items[referenceProduit]) {
      this.cart.items[referenceProduit].cotation = cotation;
      this.updateCart();
    }
  }

  public removeCotation(referenceProduit: string): void {
    if (this.cart.items[referenceProduit]) {
      this.cart.items[referenceProduit].cotation = null;
      this.updateCart();
    }
  }

  public clearAllCotationsFromCart(): void {
    Object.keys(this.cart.items).forEach(d => {
      if (this.cart.items[d]?.cotation?.perm !== 'O') {
        this.removeCotation(d);
      }
    });
    this.updateCart();
  }

  checkQteCotation() {
    return Object.values(this.cart.items).some(item => item.cotation && item.qte < item.cotation.qtecdemini);
  }

  hasCotation(): boolean {
    return Object.values(this.cart.items).some(item => item.cotation != null);
  }

  isEmpty(): boolean {
    return !this.qteProduits;
  }

  loadCart(): void {
    /*this.loading.next(true);
    const currentUserId = this.authService.currentUser?.id?.toString();
    if (currentUserId) {
      const savedCart = this.cookieService.get(`cart_${currentUserId}`);
      if (savedCart) {
        this.rebuildCart(savedCart);
      } else {
        this.resetCart();
      }
    } else {
      this.resetCart();
    }*/
    this.userIsStranger = this.authService.currentUser?.TIERSETRANGER === 'O';
    const savedCart = this.localStorage.getItem('cart');
    if (savedCart) {
      this._cart = new BehaviorSubject<Cart>(Cart.fromObject(JSON.parse(savedCart)));
      this.clearAllCotationsFromCart();
    }
  }

  rebuildCart(cart) {
    const refs = JSON.parse(cart).map(item => item.reference);
    this.httpClient.post<any>(`${environment.apiUrl}/ProduitMultById.php`, { ref: refs , withCredentials: true})
      .subscribe(response => {
        const prout = response.reduce((acc, product, i) => {
          acc[product.reference] = {
            cotation: product.cotation,
            desc: product.desc,
            produit: product,
            qte: JSON.parse(cart)[i].qte,
            reference: product.reference
          };
          return acc;
        }, {});
        this._cart.next(Cart.fromObject(prout));
        this.qteProduits = this.cart.qteProduits;
        this.loading.next(false);
      });
  }

  private resetCart() {
    this.qteProduits = 0;
    this._cart.next(new Cart());
  }

  getFormatedCart() {
    let cartFormated= {};
    Object.values(this.cart.items).map((item) => {
      cartFormated = {
        marque: item.produit.marque,
        quantite: item.qte,
        reference: item.produit.reference,
        gabarit: item.produit.gabarit,
        livraisondirecte: item.produit.livraisondirecte,
        prix: item.produit.prix,
        prixAdd: item.produit.prixAdd,
        d3e: item.produit.prixD3E,
        poidsbrut: item.produit.poidsbrut,
      };
    });
    return cartFormated;
  }

  /** Met à jour la date minimum de livraison possible et l'applique par defaut  */
  public setMinDate(panierForm: FormGroup): void {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();

    let minday: string | number;
    let minmonth: string | number;
    if (dd < 10) {
      minday = "0" + dd;
    } else {
      minday = dd;
    }
    if (mm < 10) {
      minmonth = "0" + mm;
    } else {
      minmonth = mm;
    }

    const mindate = yyyy + "-" + minmonth + "-" + minday;
    panierForm.controls["dateexpedition"].setValue(mindate);
  }

  addressValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const transporteur = control.get('transporteur')?.value;
      const adresse = control.get('adresse')?.value;
      const livraison = control.get('livraison')?.value

      if (transporteur === 'MAI'){
        return null;
      }

      if ((transporteur === 'CHR' || transporteur === 'SCH' || livraison === 'STD') && !adresse) {
        return { 'adresse': true };
      }
      return null;
    };
  }

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const date = control.get('dateexpedition')?.value;
      const day = new Date(date).getUTCDay();
      if ([6, 0].includes(day)) {
        return { 'weekend': true };
      }
      return null;
    };
  }



  portCalculaator3000(panierForm: FormGroup, event = null) {
    if(this.getPanierPortAdd(event, panierForm)){
      return this.doIneedCotationTransport(panierForm, event);
    }else{
      return this.doIneedCotationTransport(panierForm);
    }
  }

  getPanierPortAdd(targetAddress = null, panierForm: FormGroup) {
    return targetAddress && (panierForm.value.transporteur != "ENL" || panierForm.value.transporteur != "VTP");
  }

  doIneedCotationTransport(panierForm: FormGroup, target: any = null): boolean {
    let targetAdress: any;
    if (target) {
      targetAdress = target;
    } else {
      targetAdress = panierForm.value.adresse;
    }
    if (targetAdress.adresse1 == undefined) {
      return false;
    }
    return !(!this.userIsStranger && targetAdress.paysiso == "FR");

  }

  getPoidsTotal(): poidsCart {
    const cart = this.isUsingTempCart() ? this.getTempCart() : this.cart;
    let totalD3E: number = 0;
    let nbHorsGab: number = 0;
    let nbVirtuel: number = 0;
    let nbStd: number = 0;
    let totPoids: number = 0;
    let allPoids: number = 0;
    let arrReturned: poidsCart;
    Object.values(cart.items)
      .map((item) => {
        totalD3E += item.qte * item.produit.prixD3E;
        switch (
          item.produit.gabarit
          ) {
          case "H": // hors gabari
            nbHorsGab += 1;
            break;
          case "V": // virtuels
            nbVirtuel += 1;
            break;
          default: // standard
            nbStd += 1;
        }
        if (item.produit.poidsbrut) {
          if (!(nbHorsGab > 0 && item.produit.gabarit != "H")) {
            totPoids += +item.produit.poidsbrut * item.qte;
          }
          allPoids += +item.produit.poidsbrut * item.qte;
        }
        arrReturned = {totalD3E: totalD3E, nbHorsGab: nbHorsGab, nbVirtuel: nbVirtuel, nbStd: nbStd, totPoids: totPoids, allPoids: allPoids}
      });
    return arrReturned;
  }

  determineTypeEnvoi(transporteur: string, nbHorsGab: number, nbVirtuel: number, nbStd: number, codepostal: string): string {


    if (["ENL", "VTP", "LDF"].includes(transporteur)) return "E";
    if (nbHorsGab > 0) return "H";
    if (nbVirtuel > 0 && nbHorsGab === 0 && nbStd === 0) return "V";
    if (codepostal.startsWith("20") && transporteur === "CHR") return "C";
    if (transporteur === "COL") return "C";
    return nbStd > 0 ? "C" : "";
  }

  determineFrais(typeEnvoi: string, transporteur: string, nbHorsGab: number, codepostal: string, codeSchenkerTransport: string, codeCorseTransport: string, codeDefautTransport: string): string {


    if (typeEnvoi === "H") return codeSchenkerTransport;
    if (codepostal.startsWith("20") && transporteur === "CHR") return codeCorseTransport;
    if (transporteur === "COL") return "COL";
    return codeDefautTransport;
  }

  calculFrais(grilleFiltre: any, totPoids: number, portP: number, maxFranco: number, typeEnvoi: string){

    const cart = this.isUsingTempCart() ? this.getTempCart() : this.cart;
    let franco = +grilleFiltre.mtfranco >= maxFranco ? +Infinity : +grilleFiltre.mtfranco;
    if (totPoids <= +grilleFiltre.kgmax && portP === 0) {
      portP = +grilleFiltre.kgmt;
      if (typeEnvoi === "V" || typeEnvoi === "E" || cart.total >= franco) {
        portP = 0;
        franco = 0;
      }


      return { portP, franco, fraisERP: grilleFiltre.CodeERP };
    }


    return { portP, franco, fraisERP: "" };
  }

  calculEscomptesEtTaxes(totalMarchandiseHt: number, totalD3E: number, portP: number, txTVA: number, fraisCcb: number, pescompte: number) {
    const totalHtEscompte = totalMarchandiseHt + totalD3E;
    let escompte = Math.round(totalHtEscompte * (pescompte / 100) * 100) / 100;
    const tvaEscompte = Math.round((totalHtEscompte - escompte + portP) * txTVA * 100) / 100;
    const escompteCB = Math.round((totalHtEscompte + fraisCcb) * (pescompte / 100) * 100) / 100;
    const tvaEscompteCCB = Math.round((totalHtEscompte + fraisCcb + portP - escompte) * txTVA * 100) / 100;

    return { escompte, tvaEscompte, tvaEscompteCCB, escompteCB };
  }

  determinerTypeDeLivraison(gabarits: string[]): number {
    let livraisonType = 0;
    for (const gabarit of gabarits) {
      if (livraisonType === 0 && gabarit === "") {
        livraisonType = 1;
      } else if (livraisonType <= 1 && gabarit === "H") {
        livraisonType = 2;
        break;
      }
    }
    return livraisonType;
  }

  initialiserLivraisons(): {
    livraisonEmail: boolean,
    livraisonRetrait: boolean,
    livraisonChronopost: boolean,
    livraisonSchenker: boolean,
    livraisonDirecte: boolean
  } {
    return {
      livraisonEmail: false,
      livraisonRetrait: false,
      livraisonChronopost: false,
      livraisonSchenker: false,
      livraisonDirecte: false,
    };
  }

  buildAddress(submitAdress: any): any {
    if (!submitAdress) {
      return {
        nom: '',
        adresse1: '',
        adresse2: '',
        codepostal: '',
        ville: '',
        phone: '',
        paysiso: '',
        defaut: '',
        forfait: '',
        pays: '',
        payscode: '',
        payszobe: '',
      };
    }
    return submitAdress;
  }

  buildRequestParams(
    typeval: string,
    panierPort: any,
    panierForm: any,
    totalHt: number,
    fraisCcb: number,
    txTVA: number,
    submitAdress: any,
    client: number
  ): any {
    const cart = this.isUsingTempCart() ? this.getTempCart() : this.cart;





    return {
      ref: encodeURIComponent(
        JSON.stringify(
          Object.values(cart.items).map(
            (it) => it.produit.reference
          )
        )
      ),
      marque: JSON.stringify(
        Object.values(cart.items).map(
          (it) => it.produit.marque
        )
      ),
      qte: JSON.stringify(
        Object.values(cart.items).map((it) => it.qte)
      ),
      gab: JSON.stringify(
        Object.values(cart.items).map(
          (it) => it.produit.gabarit || ''
        )
      ),
      cot: JSON.stringify(
        Object.values(cart.items).map((it) =>
          it.cotation
            ? {
              numcotation: it.cotation.numcotation,
              numcotationLigne: it.cotation.numcotationLigne,
              numfrs: it.cotation.numfrs,
            }
            : null
        )
      ),
      devis: typeval == 'DEV' ? JSON.stringify(
        Object.values(cart.items).map((it) => ({
          numdevisligne: it.produit.nligne,
          numdevis: it.produit.numcommande,
        }))
      ) : null,
      typval: typeval,
      mtht: totalHt.toString(),
      sauveref: panierForm.value.ref,
      mail: panierForm.value.email,
      transport: panierForm.value.transporteur,
      port: panierPort.port,
      fraisCB: fraisCcb,
      livdir: panierForm.value.livraison,
      nom: this.sanitizForEric(submitAdress.nom || ''),
      ad1: this.sanitizForEric(submitAdress.adresse1 || ''),
      ad2: this.sanitizForEric(submitAdress.adresse2 || ''),
      cp: this.sanitizForEric(submitAdress.codepostal || ''),
      ville: this.sanitizForEric(submitAdress.ville || ''),
      phone: this.sanitizForEric(submitAdress.phone || ''),
      payx: this.sanitizForEric(submitAdress.paysiso || ''),
      datelivraison: panierForm.value.dateexpedition || '',
      vads_amount: parseFloat(panierPort.ttc.toFixed(2)), //avant panierForm peut etre erreur nom theo
      codeerp: panierPort.codeerp,
      client: client,
    };
  }

  submitOrder(params: any) {
    return this.httpClient.get(`${environment.apiUrl}/PanierControl.php`, {
      withCredentials: true,
      responseType: 'json',
      params,
    });
  }

  sanitizForEric(str: string):string{
    return str.replace(/'/g, ' ');
  }
}


export type poidsCart = {
  totalD3E: number,
  nbHorsGab: number,
  nbVirtuel: number,
  nbStd: number,
  totPoids: number,
  allPoids: number
}
