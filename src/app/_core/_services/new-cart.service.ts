import {Injectable, signal} from '@angular/core';
import {ShoppingCart, CartItem} from "@/_util/models/cart-item.interface";
import {environment} from "@env";
import {AuthenticationService} from "@services/authentication.service";
import {HttpClient} from "@angular/common/http";
import {Produit} from "@/_util/models";
import {CookieService} from "ngx-cookie-service";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class NewCartService {
  cart = signal<ShoppingCart>({
    items: [],
    totalAmount: 0,
    totalItems: 0
  });

  idUser: number;

  constructor(private cookieService: CookieService) {
    if(this.cookieService.get('jwt')){
      let decoded = jwtDecode(this.cookieService.get('jwt')) as any;
      this.idUser = decoded.data.user.id;
      //console.log(this.idUser, this.cart());
    }

  }

  /*private calculateTotalAmount(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }*/

  calculateTotalAmount(items: CartItem[]): number {
    return items.reduce((total, item) => {
      let itemPrice = item.price;
      if(item.cotation){
        const activeCotation = item.cotation.find(cot => cot.active);
        if (activeCotation) {
          itemPrice = activeCotation.prixvente;
        }
      }
      return total + itemPrice * item.quantity;
    }, 0);
  }

  addItem(item: CartItem) {
    //console.log("zozo",this.cart);

    this.cart.update((currentCart) => {
      const existingItem = currentCart.items.find(
        (i) => i.productName === item.productName
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        currentCart.items.push(item);
      }
      currentCart.totalItems = this.getTotalItems();
      currentCart.totalAmount = this.calculateTotalAmount(currentCart.items);

      const userCart = this.cookieService.get(`cart_${this.idUser}`);
      if (userCart) {
        const existingCart: ShoppingCart = JSON.parse(userCart);
        const existingCartItem = existingCart.items.find(
          (i) => i.productName === item.productName
        );

        if (existingCartItem) {
          existingCartItem.quantity += item.quantity;
        } else {
          existingCart.items.push(item);
        }
        existingCart.totalItems = this.getTotalItems();
        existingCart.totalAmount = this.calculateTotalAmount(existingCart.items);
        this.cookieService.set(`cart_${this.idUser}`, JSON.stringify(existingCart), 7, '/');
      } else {
        this.cookieService.set(`cart_${this.idUser}`, JSON.stringify(currentCart), 7, '/');
      }
      return currentCart;
    });
  }

  updateCart() {
    const userCart = this.cookieService.get(`cart_${this.idUser}`);
    if (userCart) {
      this.cart.set(JSON.parse(userCart));
    }
  }

  removeItem(productName: string) {
    this.cart.update((currentCart) => {
      const item = currentCart.items.find((i) => i.productName === productName);
      this.removeItemFromCookie(item);
      if (item) {
        currentCart.totalAmount -= item.price * item.quantity;
        currentCart.items = currentCart.items.filter(
          (i) => i.productName !== productName
        );
      }
      this.updateCart();
      return currentCart;
    });
  }

  private removeItemFromCookie(item: CartItem) {
    const userCart = this.cookieService.get(`cart_${this.idUser}`);
    if (userCart) {
      const existingCart: ShoppingCart = JSON.parse(userCart);
      const existingItem = existingCart.items.find(
        (i) => i.productName === item.productName
      );

      if (existingItem) {
        existingCart.totalAmount -= item.price * item.quantity;
        existingCart.items = existingCart.items.filter(
          (i) => i.productName !== item.productName
        );
        this.cookieService.set(`cart_${this.idUser}`, JSON.stringify(existingCart), 7, '/');
      }
    }
  }

  getTotalItems(): number {
    let total = 0;
    this.cart().items.forEach(item => {
      total += item.quantity;
    });
    return total;
  }

  getCart(): ShoppingCart {
    let decoded = jwtDecode(this.cookieService.get('jwt')) as any;
    const id = decoded.data.user.id;
    if(this.cookieService.get(`cart_${id}`)){
      this.updateCart();
    }
    return this.cookieService.get(`cart_${id}`) ? JSON.parse(this.cookieService.get(`cart_${id}`)) : this.cart();
  }

  getQtePerItem(reference: string): number {
   // return this.cart().items.find(item => item.productName === reference).quantity;
   const cart = this.cart();
   if (!cart || !cart.items) {
     // Handle the case where cart or cart.items is undefined
     console.error('Cart or cart items are undefined');
     return null; // or any default value you prefer
   }

   const item = cart.items.find(item => item.productName === reference);
   if (!item) {
     // Handle the case where the item is not found
     console.error('Item not found in cart');
     return null; // or any default value you prefer
   }

   return item.quantity;
  }

  changeNumberOfProduct(productName: string, qte: number) {
    this.cart.update((currentCart) => {
      const item = currentCart.items.find((i) => i.productName === productName);
      this.changeNumberOfProductFromCookie(productName, qte);
      if (item) {
        item.quantity = qte;
        currentCart.totalItems = this.getTotalItems();
        currentCart.totalAmount = this.calculateTotalAmount(currentCart.items);
      }
      this.updateCart();
      return currentCart;
    });
  }

  private changeNumberOfProductFromCookie(productName: string, qte: number) {
    const userCart = this.cookieService.get(`cart_${this.idUser}`);
    if (userCart) {
      const existingCart: ShoppingCart = JSON.parse(userCart);
      const existingItem = existingCart.items.find(
        (i) => i.productName === productName
      );

      if (existingItem) {
        existingItem.quantity = qte;
        existingCart.totalItems = this.getTotalItems();
        this.cookieService.set(`cart_${this.idUser}`, JSON.stringify(existingCart), 7, '/');
      }
    }
  }
}
