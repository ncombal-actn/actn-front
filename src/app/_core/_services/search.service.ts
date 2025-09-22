import { Injectable } from '@angular/core';
import { Search } from '@/_util/models/search';
import { Observable } from 'rxjs';
import { Filtre, Produit } from '@/_util/models';
import { shareReplay } from 'rxjs/operators';

const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private _searchFiltres: Search;
  private _searchProduits: Search;
  private _produits$: Observable<Produit[]>;
  private _filtres$: Observable<Filtre[]>;
  private _etatsFiltres: Array<string>;

  get searchFiltres(): Search {
    return this._searchFiltres;
  }
  set searchFiltres(search: Search) {
    this._searchFiltres = search;
  }

  get searchProduits(): Search {
    return this._searchProduits;
  }
  set searchProduits(search: Search) {
    this._searchProduits = search;
  }

  get filtres(): Observable<Filtre[]> {
    if (this._filtres$ != null) {
      return this._filtres$;
    } else {
      return new Observable<Filtre[]>();
    }
  }
  set filtres(filtres: Observable<Filtre[]>) {
    this._filtres$ = filtres.pipe(shareReplay(CACHE_SIZE));
    this._etatsFiltres = [];
  }

  get produits(): Observable<Produit[]> {
    if (this._produits$ != null) {
      return this._produits$;
    } else {
      return new Observable<Produit[]>();
    }
  }
  set produits(produits: Observable<Produit[]>) {
    this._produits$ = produits.pipe(shareReplay(CACHE_SIZE));
  }

  get etatsFiltres(): Array<string> {
    return this._etatsFiltres;
  }
  set etatsFiltres(etats: Array<string>) {
    this._etatsFiltres = etats;
  }

  constructor() {
    this._searchFiltres = new Search();
    this._searchProduits = new Search();
    this._produits$ = null;
    this._filtres$ = null;
    this._etatsFiltres = [];
  }

  /**
   * Indique si la recherche de filtre doit être executé ou non
   * @param search La recherche en cours d'exécution
   */
  public filtreARecherche(search: Search): boolean {
    return !this._searchFiltres.equals(search);
  }

  /**
   * Indique si la recherche de produits doit être executé ou non
   * @param search La recherche en cours d'exécution
   */
  public produitsARecherche(search: Search): boolean {
    return !this._searchProduits.equals(search);
  }
}
