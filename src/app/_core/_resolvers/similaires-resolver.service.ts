import { CatalogueSample, Filtre } from '@/_util/models';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ProduitService } from '@core/_services/produit.service';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

/** Service Resolver récupérant les produits en promotion  */
@Injectable({
  providedIn: 'root'
})
export class SimilairesResolverService implements Resolve<CatalogueSample> {

  constructor(private produitService: ProduitService) { }

  /**
   * Récupère la liste des Produits similaire
   * Depuis de 'ProduitService'
   */
  resolve(route: ActivatedRouteSnapshot): Observable<CatalogueSample> {
    const ref = route.params['id'];

    return this.produitService.getProduitSimilaire(ref).pipe(
      switchMap(produits => {
        const filtres$ = of([]); // Initialize filtres$ as an observable of an empty array
        return filtres$.pipe(
          map(filtres => ({ filtres$, produits$: of(produits) }))
        );
      }),
      catchError(error => {
        console.error('Error fetching similar products', error);
        return of({ filtres$: of([]), produits$: of([]) }); // Return an empty CatalogueSample on error
      })
    );
  }
}