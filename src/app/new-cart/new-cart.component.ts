import {Component, computed, OnInit} from '@angular/core';
import {NewCartService} from "@services/new-cart.service";
import {CartItem, ShoppingCart} from "@/_util/models/cart-item.interface";
import {linearGradient} from "html2canvas/dist/types/css/types/functions/linear-gradient";
import {toObservable} from "@angular/core/rxjs-interop";
import {Observable} from "rxjs";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-new-cart',
  templateUrl: './new-cart.component.html',
  styleUrl: './new-cart.component.scss'
})
export class NewCartComponent implements OnInit{

  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  cartItems$: Observable<ShoppingCart>;
  cmdOrDevis: FormControl = new FormControl('',Validators.required);

  constructor(
    private cartService: NewCartService
  ) {
    this.cartItems$ = toObservable(this.cartService.cart);
  }

  ngOnInit() {
    this.cartService.getCart();
    this.cartItems$.subscribe((cart) => {
      
      this.cartItems = cart.items;
      this.totalAmount = cart.totalAmount;
    });

  }

  removeItem(productId: string) {
    this.cartService.removeItem(productId);
    this.udpateCart();
  }

  udpateCart() {
    this.cartItems = this.cartService.cart().items;
    this.totalAmount = this.cartService.cart().totalAmount;
  }
}
