import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Produit } from '@/_util/models';

// SERVICES
import { CartService } from '@/_core/_services/cart.service';
import { Cotation } from '@/_util/models/cotation';
import {ProduitService} from "@services/produit.service";
import {NgClass} from "@angular/common";
import {InputNumberComponent} from "@/_util/components/input-number/input-number.component";

/**
 * Formulaire d'ajout au panier. Comprend le bouton "Ajouter au panier", l'input de qte, et les boutons + et - pour régler la qte.
 */
@Component({
  selector: 'app-add-to-cart-form',
  standalone: true,
  templateUrl: './add-to-cart-form.component.html',
  imports: [
    NgClass,
    InputNumberComponent
  ],
  styleUrls: ['./add-to-cart-form.component.scss']
})
export class AddToCartFormComponent implements  AfterViewInit {

  @Input() produit: Produit;
  @Input() isDisabled = false;
  @Input() direction = 'row';
  @Input() showInput = true;
  @Input() cotation: Cotation = null;


  @Input()
  get quantite(): number {
      return this._quantite;
  }
  set quantite(value: number) {
      this.invalide = false;
      this._quantite = value;
  }

  @Output() added = new EventEmitter<boolean>(false);

  @Output() qtyInCart = new EventEmitter<number>();

/////////////////////////////////////////////////
  avaiable: boolean = true;
/////////////////////////////////////////////////

  private _quantite = 1;
  invalide = false;

  constructor(
      public cartService: CartService,
      private produitService: ProduitService,
  ) { }



  ngAfterViewInit(): void {
      setTimeout(() => {
          const quantiteProduitDansPanier = this.cartService.getQteProduit(this.produit);
          this.quantite = quantiteProduitDansPanier === 0 && +this.produit.qtemini === 0 ? 1
              : quantiteProduitDansPanier === +this.produit.qtemaxi ? 0
                  : quantiteProduitDansPanier >= +this.produit.qtemini ? 1
                      : +this.produit.qtemini > 0 ? +this.produit.qtemini : 1;
      });
  }

  valueChange(event: number): void {
      this.quantite = event;
  }

  /**
   * Met à jour la qte du produit concerné dans le panier.
   */
  ajouterAuPanier(): void {


      this.invalide = this.isQuantiteInvalide();
      if (!this.invalide) {
        this.produitService.getProduitDescriptionById(this.produit.reference).subscribe(
          (description) => {
            this.cartService.addProduit(this.produit, this.quantite, this.cotation, description[0]);
            this.added.emit(true);
            this.qtyInCart.emit(this.cartService.cart.items[this.produit.reference]?.qte);
          }
        )
      }
  }

  maximum(): number {
      if (this.produit != null) {
          if (this.cartService.cart.items[this.produit.reference]?.cotation) {
              return (this.cartService.cart.items[this.produit.reference].cotation.qtecdemax - this.cartService.cart.items[this.produit.reference].cotation.qtecde);
          }
          else {
              return (this.produit.codePromo === 'D' || this.produit.codePromo === 'K' ) ? this.produit.qteStock1 - this.cartService.getQteProduit(this.produit) : Number.MAX_SAFE_INTEGER;
          }
      } else {
          return 0;
      }
  }

  /**
   * Indique si la quantité que l'utilisateur essaye d'ajouter au panier est valide ou non.
   * @returns true si la quantité est invalide, false sinon
   */
  isQuantiteInvalide(): boolean {
      return ((this.produit?.codePromo === 'D' || this.produit.codePromo === 'K')
          && (this.cartService.getQteProduit(this.produit) >= this.produit?.qteStock1)
          && (this.quantite >= 0))
          ||
          // si on essaye de selectionner moins que la quantité minimum
          (+this.produit.qtemini !== 0
              && this.cartService.getQteProduit(this.produit) + this.quantite < +this.produit.qtemini)
          ||
          // si on essaye de selectionner plus que la quantité max
          (+this.produit.qtemaxi > +this.produit.qtemini
              && this.cartService.getQteProduit(this.produit) + this.quantite > +this.produit.qtemaxi)
          ||
          ((this.cartService.cart.items[this.produit.reference]?.cotation?.qtecdemax - this.cartService.cart.items[this.produit.reference]?.cotation?.qtecde) < this.cartService.getQteProduit(this.produit) + this.quantite);
  }

}
