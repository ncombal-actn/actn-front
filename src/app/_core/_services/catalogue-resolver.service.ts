/* import { Injectable } from '@angular/core';
import { CatalogueService } from './catalogue.service';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CatalogueSample } from '@/_util/models';
import { ProduitService } from './produit.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogueResolverService {

  constructor(
    private catalogueService: CatalogueService,
    private router: Router,
    private produitService: ProduitService,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CatalogueSample> {
    const decodeIfNotNull = (str: string) => str != null ? decodeURI(str) : str;

    const search = decodeIfNotNull(route.queryParamMap.get('search'));
    const marque = decodeIfNotNull(route.queryParamMap.get('marque'));
    const niveau1 = decodeIfNotNull(route.queryParamMap.get('niv1'));
    const similaire = decodeIfNotNull(route.queryParamMap.get('similaire'));

    return this.catalogueService.generateStructure().pipe(
      take(1),
      map(v => {
        let ids = [];
        let niv1 = decodeIfNotNull(route.queryParamMap.get('niv1'));
        if (niv1 == null) {
          niv1 = decodeIfNotNull(route.paramMap.get('niv1'));
          const niv2 = decodeIfNotNull(route.paramMap.get('niv2'));
          const niv3 = decodeIfNotNull(route.paramMap.get('niv3'));
          const labels = [].concat(niv1 ?? []).concat(niv2 ?? []).concat(niv3 ?? []);
          ids = this.catalogueService.findIds(labels);
        } else {
          ids = [
            niv1,
            decodeIfNotNull(route.queryParamMap.get('niv2')),
            decodeIfNotNull(route.queryParamMap.get('niv3'))
          ];
        }
        return {
          category: niveau1 ? niveau1 : ids?.[0] ?? '',
          subCategory: ids?.[1] ?? '',
          subSubCategory: ids?.[2] ?? ''
        };
      }),
      take(1),
      map(position => {
        return {
          filtres$: this.catalogueService.getFiltres(position, search, marque),
          produits$: this.produitService.getProduits(position, search, marque)
        };
      })
    );
  }
}
 */

import { Injectable } from '@angular/core';
import { CatalogueService } from './catalogue.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { CatalogueSample } from '@/_util/models';
import { ProduitService } from './produit.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogueResolverService implements Resolve<CatalogueSample> {
  constructor(
    private catalogueService: CatalogueService,
    private produitService: ProduitService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CatalogueSample> {
    const decodeIfNotNull = (str: string) => str != null ? decodeURI(str) : str;

    const search = decodeIfNotNull(route.queryParamMap.get('search'));
    const marque = decodeIfNotNull(route.queryParamMap.get('marque'));
    const niveau1 = decodeIfNotNull(route.queryParamMap.get('niv1'));

    return this.catalogueService.generateStructure().pipe(
      take(1),
      map(() => {
        let ids = [];
        let niv1 = decodeIfNotNull(route.queryParamMap.get('niv1'));
        if (niv1 == null) {
          niv1 = decodeIfNotNull(route.paramMap.get('niv1'));
          const niv2 = decodeIfNotNull(route.paramMap.get('niv2'));
          const niv3 = decodeIfNotNull(route.paramMap.get('niv3'));
          const labels = [].concat(niv1 ?? []).concat(niv2 ?? []).concat(niv3 ?? []);
          ids = this.catalogueService.findIds(labels);
         
          
        } else {
          ids = [
            niv1,
            decodeIfNotNull(route.queryParamMap.get('niv2')),
            decodeIfNotNull(route.queryParamMap.get('niv3'))
          ];
        }
        return {
          category: niveau1 ? niveau1 : ids?.[0] ?? '',
          subCategory: ids?.[1] ?? '',
          subSubCategory: ids?.[2] ?? ''
        };
      }),
      map(position => {
    
        return {
          filtres$: this.catalogueService.getFiltres(position, search, marque),
          produits$: this.produitService.getProduits(position, search, marque),
       
        };
      }),
      catchError(err => {
        
        return of({
          filtres$: of([]),
          produits$: of([])
        });
      })
    );
  }
}
