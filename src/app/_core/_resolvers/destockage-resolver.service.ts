import { Injectable } from '@angular/core';
import { ProduitService } from '@core/_services/produit.service';
import { Observable, Subject } from 'rxjs';
import { CatalogueSample, Filtre } from '@/_util/models/catalogue';
import { shareReplay } from 'rxjs/operators';
import {ActivatedRoute} from "@angular/router";
import {CatalogueComponent} from "@/catalogue/catalogue.component";

/** Service Resolver récupérant les produits en déstockage  */
@Injectable({
    providedIn: 'root'
})
export class DestockageResolverService {

  param: string = '';

  constructor(private produitService: ProduitService) {
  }

  /**
   * Récupère la liste des Produits en promos Destockage
   * Depuis de 'ProduitService'
   */
  resolve(route: ActivatedRoute): Observable<CatalogueSample> {
    if(route.queryParams['periode']){
      this.param = route.queryParams['periode'];
    }
    const filtres$ = new Subject<Array<Filtre>>();
    const produits$ = this.produitService.getPromos("D", this.param).pipe(shareReplay(1));
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
