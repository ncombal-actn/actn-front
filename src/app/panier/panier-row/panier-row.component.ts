import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterContentInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {CartItem, Produit, Client} from '@/_util/models';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

import {environment} from '@env';

import {ProduitService} from '@core/_services/produit.service';
import {CartService} from '@core/_services';

@Component({
  selector: 'app-panier-row',
  templateUrl: './panier-row.component.html',
  styleUrls: ['./panier-row.component.scss']
})
export class PanierRowComponent implements OnInit, OnDestroy, AfterContentInit {

  environment = environment;
  @Input() cartItem: CartItem;
  @Input() showInputNumber: boolean = true;
  @Input() cotationNotEditable: boolean = false;
  @Output() error = new EventEmitter<boolean>();
  @Input() priceChange: boolean = false;
  @Input() indexRow: number;
  @Output() panierValid = new EventEmitter<any>();
  produitComm: Produit = new Produit();
  display = [];


  showPopup = false;
  currentClient = new Client();
  currentIndex = 0;
  warningOnCotationQte: boolean = false;

  @Input() displayFormationForm: boolean = false;
  isFormation: boolean = false;
  _wrongValueMin = false;
  private _destroy$ = new Subject<void>();

  constructor(
    public produitService: ProduitService,
    public cartService: CartService,
    private http: HttpClient,
  ) {
  }

  _wrongValue = false;

  get wrongValue(): boolean {
    return this._wrongValue;
  }

  set wrongValue(value: boolean) {
    this._wrongValue = value;
    this.error.emit(this._wrongValue);
  }

    ngOnInit(): void {


      this.cartService.cart$.pipe(takeUntil(this._destroy$)).subscribe((d) => {
        //console.log('dans panier-row cartService.cart$', d);
        
        this.wrongValue = (this.cartService.cart.items[this.cartItem.produit.reference]?.cotation?.qtecdemax - this.cartService.cart.items[this.cartItem.produit.reference]?.cotation?.qtecde) < this.cartService.getQteProduit(this.cartItem.produit);
        this.warningOnCotationQte = ( (this.cartService.cart.items[this.cartItem.produit.reference]?.cotation?.qtecdemax - this.cartService.cart.items[this.cartItem.produit.reference]?.cotation?.qtecde) < this.cartService.getQteProduit(this.cartItem.produit) );
      });
      // récupération des formulaire google d'inscription en la précense d'une formation

      if (this.cartItem.produit.niveaucode1 == "FOR")
      {
          this.isFormation = true;
      }
    }

  ngAfterContentInit() {
    this.display[this.indexRow] = false;

  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Met à jour la quantité d'un produit quand le champ de quantité est modifié.
   */
  quantiteChange(cartItem: CartItem, event: number): void {
    this.wrongValue = (+cartItem.produit.qtemini !== 0 && +cartItem.produit.qtemini < +cartItem.produit.qtemaxi
        && (event < +cartItem.produit.qtemini || event > +cartItem.produit.qtemaxi))
      || (+cartItem.produit.qtemini !== 0 && +cartItem.produit.qtemini !== 1 && +cartItem.produit.qtemini > +cartItem.produit.qtemaxi
        && (event < +cartItem.produit.qtemini))
      || ((this.cartService.cart.items[this.cartItem.produit.reference]?.cotation?.qtecdemax - this.cartService.cart.items[this.cartItem.produit.reference]?.cotation?.qtecde) < this.cartService.getQteProduit(this.cartItem.produit));
    this._wrongValueMin = this.cartItem.qte < this.cartService.cart.items[this.cartItem.produit.reference]?.cotation?.qtecdemini;
    this.panierValid.emit(this.cartService.cart.items);
    if (event <= 0) {
      this.cartService.removeProduit(cartItem.produit);
    } else {
      this.cartService.updateQuantiteProduit(cartItem.produit, event);
    }
  }

  removeProduit(cartItem: CartItem): void {
    this.cartService.removeProduit(cartItem.produit);
  }

  maximum(produit: Produit): number {
    return (produit.codePromo === 'D' || produit.codePromo === 'K') ? produit.qteStock1 : Number.MAX_SAFE_INTEGER;
  }

  showEnduserForm(client: Client, index: number): void {
    this.currentClient = client;
    this.currentIndex = index;
    this.showPopup = true;
  }

  clientChange(client: Client): void {
    if (client != null) {
      this.cartService.clientFinal = new Client(
        client.adresse1,
        client.adresse2,
        client.codepostal,
        client.mail,
        client.nom,
        client.telephone,
        client.ville,
        client.pays
      );
    }
    this.currentIndex = -1;
    this.showPopup = false;
  }

  isReducQt(cartItem: CartItem): boolean {
    if (cartItem.produit.prixPar > 0) {
      return !(cartItem.qte >= cartItem.produit.qtePar);
    } else {
      return true;
    }
  }

}
