import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Produit} from '@/_util/models/produit';
import {ProduitService} from '@core/_services/produit.service';
import {forkJoin, Observable, of} from 'rxjs';
import {map, switchMap, take} from 'rxjs/operators';
import {Meta} from '@angular/platform-browser';

import {environment} from '@env';
import {AuthenticationService, TitleService} from '@core/_services';

@Injectable({
  providedIn: 'root'
})
export class ProduitResolverService {

  constructor(
    private router: Router,
    private produitService: ProduitService,
    private title: TitleService,
    private metaService: Meta,
    private authService: AuthenticationService
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ProduitWithDescription> {
    const produitId = route.paramMap.get('ref');
    return this.produitService.getProduitById(produitId).pipe(
      switchMap(produit => {
        return forkJoin({
          nbPhotos: this.produitService.getNombrePhotosProduitByID(produit.photo).pipe(take(1)),
          description: this.produitService.getProduitDescriptionById(produitId).pipe(take(1)),
          produitsAssocies: this.produitService.getProduitsAssociationVente(produitId).pipe(take(1)),
          produitsRemplacement: this.produitService.getProduitsRemplacement(produitId).pipe(take(1)),
          getProduitsRenouvellement: this.produitService.getProduitsRenouvellement(produitId).pipe(take(1)),
          //produitsSimilaires: this.produitService.getProduitSimilaire(produitId).pipe(take(1))
        }).pipe(
          map(({nbPhotos, description, produitsAssocies, produitsRemplacement, getProduitsRenouvellement}) => { //produitsSimilaires
            this.title.addTitle(produit.marquelib);
            this.metaService.updateTag({
              name: 'description',
              content: `ACTN - ${produit.marquelib} - ${produit.reference} - ${produit.designation}`
            });
            this.metaService.updateTag({
              name: 'keywords',
              content: `${produit.marquelib}, ${produit.reference}, ${produit.reffournisseur}, ${produit.niveaulibelle1}, ${produit.niveaulibelle2}, ${produit.niveaulibelle3}, ${produit.niveaulibelle4}`
            });
            this.metaService.updateTag({
              property: 'og:title',
              content: `ACTN - ${produit.marquelib} - ${produit.reference}`
            });
            this.metaService.updateTag({property: 'og:description', content: produit.designation});
            this.metaService.updateTag({
              property: 'og:image',
              content: `${environment.photosUrl}${produit.photo}.webp`
            });
            this.metaService.updateTag({property: 'og:url', content: `https://www.actn.fr/actn${this.router.url}`});
            return {
              produit$: of(produit),
              description$: of(description),
              produitsAssocies$: of(produitsAssocies),
              produitsRemplacement$: of(produitsRemplacement),
              produitsRenouvellement$: of(getProduitsRenouvellement),
              nbrPhotos: nbPhotos
             // produitsSimilaires$: of(produitsSimilaires)
            } as ProduitWithDescription;
          })
        );
      })
    );
  }
}

export class ProduitWithDescription {
  produit$: Observable<Produit>;
  description$: Observable<any>;
  produitsAssocies$: Observable<Array<Produit>>;
  produitsRemplacement$: Observable<Array<Produit>>;
  nbrPhotos: number;
  produitsRenouvellement$?: Observable<Array<Produit>>;
  //produitsSimilaires$: Observable<Array<Produit>>;
}
