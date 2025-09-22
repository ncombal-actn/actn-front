import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Interdit l'accès au chemin si aucun des paramètres de requête "search" ou "marque" n'est présent dans l'url.
 */
@Injectable({
  providedIn: 'root'
})
export class HasValidQueryParametersGuard  {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return !(!next.queryParams.marque && !next.queryParams.search);
  }
}
