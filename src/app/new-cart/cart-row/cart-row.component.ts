import {Component, Input} from '@angular/core';
import {CartItem} from "@/_util/models/cart-item.interface";
import {NewCartService} from "@services/new-cart.service";
import {MatCard} from "@angular/material/card";
import {NgClass} from "@angular/common";
import {InputNumberComponent} from "@/_util/components/input-number/input-number.component";
import {MatIcon} from "@angular/material/icon";
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {CotationRowComponent} from "@/_util/components/cotation-row/cotation-row.component";

@Component({
  selector: 'app-cart-row',
  standalone: true,
  templateUrl: './cart-row.component.html',
  imports: [
    MatCard,
    NgClass,
    InputNumberComponent,
    MatIcon,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    CotationRowComponent
  ],
  styleUrl: './cart-row.component.scss'
})
export class CartRowComponent {
  @Input() item: CartItem;

  constructor(protected cartService: NewCartService) {}

  changeNumberOfProduct(qte: number) {
    this.cartService.changeNumberOfProduct(this.item.productName, qte);
  }
}
