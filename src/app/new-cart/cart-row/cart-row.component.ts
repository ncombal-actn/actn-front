import {Component, Input} from '@angular/core';
import {CartItem} from "@/_util/models/cart-item.interface";
import {NewCartService} from "@services/new-cart.service";

@Component({
  selector: 'app-cart-row',
  templateUrl: './cart-row.component.html',
  styleUrl: './cart-row.component.scss'
})
export class CartRowComponent {
  @Input() item: CartItem;

  constructor(protected cartService: NewCartService) {}

  changeNumberOfProduct(qte: number) {
    this.cartService.changeNumberOfProduct(this.item.productName, qte);
  }
}
