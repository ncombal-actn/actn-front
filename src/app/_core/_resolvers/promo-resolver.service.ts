import {Injectable} from '@angular/core';
import {ProduitService} from '@core/_services/produit.service';
import {Observable, Subject} from 'rxjs';
import {CatalogueSample, Filtre} from '@/_util/models/catalogue';
import {shareReplay} from 'rxjs/operators';
import {ActivatedRouteSnapshot} from "@angular/router";

/** Service Resolver récupérant la promo du type passé en paramètre  */
@Injectable({
  providedIn: 'root'
})
export class PromoResolverService {

  constructor(private produitService: ProduitService) {
  }

  /**
   * Récupère la liste des Produits en Promotion
   * Depuis de 'ProduitService'
   */
  resolve(route: ActivatedRouteSnapshot): Observable<CatalogueSample> {
    const type = route.paramMap.get('type')!;
    const filtres$ = new Subject<Array<Filtre>>();
    const produits$ = this.produitService.getPromos(type, '').pipe(shareReplay(1));
    produits$.subscribe(() => {
      filtres$.next([]);
      filtres$.complete();
    });

    return new Observable(obs => {
      obs.next(
        {
          filtres$: filtres$.asObservable(),
          produits$
        } as CatalogueSample);
      obs.complete();
    });
  }

}
