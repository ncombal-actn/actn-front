import { CatalogueSample, Filtre } from '@/_util/models';
import { Injectable } from '@angular/core';
import { ProduitService } from '@core/_services/produit.service';
import { Observable, shareReplay, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepackagingResolverService {

  constructor(private produitService: ProduitService) { }
 
   /**
    * Récupère la liste des Produits similaire
    * Depuis de 'ProduitService'
    */
   resolve(): Observable<CatalogueSample> {
           const filtres$ = new Subject<Array<Filtre>>();
           const produits$ = this.produitService.getPromos("K",'').pipe(shareReplay(1));
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
