import {Component, Input} from '@angular/core';
import {NewCartService} from "@services/new-cart.service";
import {Produit} from "@/_util/models";
import {CartItem} from "@/_util/models/cart-item.interface";
import {InputNumberComponent} from "@/_util/components/input-number/input-number.component";
import {MatButton} from "@angular/material/button";
import {MatBadge} from "@angular/material/badge";

@Component({
  selector: 'app-new-add-to-cart',
  standalone: true,
  templateUrl: './new-add-to-cart.component.html',
  imports: [
    InputNumberComponent,
    MatButton,
    MatBadge
  ],
  styleUrl: './new-add-to-cart.component.scss'
})
export class NewAddToCartComponent {

  @Input() product: Produit;
  quantity: number = 1;

  constructor(private cartService: NewCartService) {}

  addToCart() {
    const item: CartItem = {
      designation: this.product.designation,
      marque: this.product.marque,
      marquelib: this.product.marquelib,
      pdf: this.product.pdf,
      price: this.product.prix,
      prixD3E: this.product.prixD3E,
      prixPublic: this.product.prixPublic,
      productName: this.product.reference,
      quantity: this.quantity,
      stock: this.product.qteStock1,
      cotation: this.product.cotation,
      cotIndex: -1
    };
    this.cartService.addItem(item);
  }

  quantityChange(qte: number) {
    this.quantity = qte;
  }

  getQtePerItem(){
    return this.cartService.getQtePerItem(this.product.reference);
  }
}
