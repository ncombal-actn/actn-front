import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { CartService } from '@/_core/_services';

/**
 * Interdit l'accès à un chemin si :
 * - le panier est vide
 * - On ne vient pas du panier
 */
@Injectable({ providedIn: 'root' })
export class PanierValidationGuard  {
    constructor(
        private cartService: CartService,
        private router: Router
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (Object.values(this.cartService.cart.items).length > 0) {
          return true;
      } else {
          this.router.navigateByUrl('/panier');
          return false;
      }
    }

}
