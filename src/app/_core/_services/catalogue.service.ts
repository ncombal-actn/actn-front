import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, retry} from 'rxjs';
import {CataloguePosition, Categorie, Filtre, Produit, Tree,} from '@/_util/models';
import {map, shareReplay, take} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {Search} from '@/_util/models/search';
import {SearchService} from './search.service';
import {environment} from '@env';
import {StorageService} from './storage.service';

/**
 * Service pour le parcours du catalogue.
 */
@Injectable({
  providedIn: 'root'
})

export class CatalogueService implements OnInit {

  /**
   * Dictionnaire associant les labels des catégories à leurs IDs.
   * Permet notamment de résoudre la position du catalogue par rapport aux labels des catégories contenus dans l'URL
   */
  mapCategoriesLabelxID: Observable<Map<string, string>>;
  erreur = new Produit();
  listCat = new Map<Array<string>, any>();
  isFilArianne: boolean = true;

  private _structures$: Observable<Tree<Categorie>>;

  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private storageService: StorageService) {
    this._structures$ = this.storageService.getStoredData('catalogue', 'structure', () => {
      return this.httpClient.get<Tree<Categorie>>(`${environment.cacheApiUrl}/ListeCategorie.php`, {
        withCredentials: true
      });
    }).pipe(shareReplay(1));
    const removeAccents = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  ngOnInit(): void {
  }

  /**
   * Génère l'arborescence du catalogue
   * @returns L'arborescence du catalogue.
   */
  generateStructure() {

    return this._structures$.pipe(take(1), map(data => {

       // récupération de la liste de toutes les catégories
      if (this.listCat.size <= 0) // yey, on fait plus 214 loop pour rien à chaque run de catalogue A BA SUPER JOFFREY MERCI also regarder si label2 fait crash le fils d'ariane sur la prod
      {
        this.listCat = new Map();
        for (const categorie of data.nodes) {
          const subCat = new Map();
          for (const subCategorie of categorie.nodes) {
            const subSubCat = new Map();
            if (subCategorie.nodes) {
              for (const subSubCategorie of subCategorie.nodes) {
                subSubCat.set([subSubCategorie.value.id, subSubCategorie.value.label], []);//, subSubCategorie.value.label2
              }
            }
            subCat.set([subCategorie.value.id, subCategorie.value.label], subSubCat); //, subCategorie.value.label2
          }
          this.listCat.set([categorie.value.id, categorie.value.label], subCat); //, categorie.value.label2
        }
      }
     
      
      return this.listCat; // après formatage de la liste en map recursive, on la renvoi dans observable
    }, err => {
      //console.log(err);
    }));
  }

  /**
   * Trouve les ids correspondant aux labels fournis.
   * @param labels Labels à rechercher [niv1, niv2, niv3]
   * @returns Un tableau d'id [id1, id2, id3]
   */
  findIds(labels: Array<string>): Array<string> {
    const search = (labels: Array<string>, list: Map<string[], any>, acc: Array<string>) => {
      const keys = list.entries();
      let key = keys.next();
      while (!key.done) {
        if (key.value[0][1] === labels[0]) {
          if (labels.length === 1) {
            return acc.concat(key.value[0][0]);
          } else {
            return search(labels.slice(1, labels.length), list.get(key.value[0]), acc.concat(key.value[0][0]));
          }
        }
        key = keys.next();
      }
    };
    
    return search(labels, this.listCat, []);
  }

  /**
   * Récupère la structure du catalogue.
   */
  getStructure() {
    
    this.mapCategoriesLabelxID = this._structures$.pipe(
      map(tree => this.generateCategoriesIDsMap(tree, new Map())));
    return this._structures$;
  }

  /**
   * Récupère la structure du catalogue.
   */
  getStructureTest() {

    this.mapCategoriesLabelxID = this._structures$.pipe(
      map(tree => this.generateCategoriesIDsMap(tree, new Map())));
    return this._structures$;
  }

  /** Renvoie this.isFilArianne */
  getFilArianne() {
    return this.isFilArianne;
  }

  /**
   * Set this.isFilArianne
   * @param bool Nouvelle valeur de this.isFilArianne
   */
  setFilArianne(bool: boolean) {
    this.isFilArianne = bool;
  }

  /**
   * Méthode récursive parcourant un arbre de catégories pour génèrer le dictionnaire associant les labels des catégories à leurs IDs.
   * @param tree Un arbre de catégories
   * @param acc Accumulateur représentant le dictionnaire généré progressivement.
   */
  generateCategoriesIDsMap(
    tree: Tree<Categorie>,
    acc: Map<string, string>
  ): Map<string, string> {
    tree.nodes.forEach(node => {
      //console.log('STAY IN ',node);

      acc.set(node.value.label, node.value.id);
      if (node.nodes) {
        this.generateCategoriesIDsMap(node, acc);
      }
    });
    return acc;
  }

  /**
   * Récupère une liste de produits depuis le backend en fonction d'un tableau de références.
   * @param refs Tableau de références de produits à rechercher.
   */
  getProductsById(refs: string[]) {
    return this.httpClient.get<Produit[]>(`${environment.apiUrl}/ProduitsByID.php?refs=${refs.join(',')}`,
      {withCredentials: true}
    );
  }

  /**
   * Appelle ListeMarques.php via http get et renvoie son observable
   * @returns Observable du résultat de ListeMarques.php
   */
  getTarifs(): Observable<any> {
    return this.httpClient.get<any>(`${environment.apiUrl}/ListeMarques.php`,
      {withCredentials: true}
    );
  }

  /**
   * Appelle ListeCategorieMarque.php via http get et renvoie son observable
   * @returns Observable du résultat de ListeCategorieMarque.php
   */
  getCategoriesByMarques(): Observable<any> {
    return this.httpClient.get<any>(`${environment.cacheApiUrl}/ListeCategorieMarque.php`,
      {withCredentials: true}
    );
  }

  /**
   * Appelle ListeNiv1Marque.php via http get et renvoie son observable
   * @returns Observable du résultat de ListeNiv1Marque.php
   */
  getCategoriesMarque(): Observable<any> {
    return this.httpClient.get<any>(`${environment.cacheApiUrl}/ListeNiv1Marque.php`,
      {withCredentials: true}
    );
  }

  /**
   * Récupère la liste des filtres disponibles pour les options de parcours de catalogue spécifiées.
   * @param position Position dans le catalogue sous la forme { niv1, niv2, niv3 }
   * @param search
   * @param marque
   */
  public getFiltres(position: CataloguePosition, search: string, marque: string): Observable<Filtre[]> {
    const s = new Search(position, search, marque);
    if (this.searchService.filtreARecherche(s)) {
      this.searchService.searchFiltres = s;
      this.searchService.filtres = this._getAvailableFiltres(position, search, marque);
    }
    return this.searchService.filtres;
  }

  /**
   * Effectue la requette http get Filtres.php pour this.getFiltres()
   * Renvoie l'Observable du résultat de Filtres.php
   * @param position Position dans le catalogue à laquelle on veut connaitre les filtres
   * @param search Chaine de caractère filtrant les produits desquels on retourne les filtres par référence
   * @param marque Chaine de caractère filtrant les produits desquels on retourne les filtres par marque
   */
  private _getAvailableFiltres(position: CataloguePosition, search: string, marque: string) {
    // console.log('niv1', position.category, 'niv2', position.subCategory, 'niv3', position.subSubCategory);
    return this.httpClient.get<Filtre[]>(`${environment.apiUrl}/Filtres.php`,
      {
        params: new HttpParams().set('search', search || '')
          .append('marque', marque || '')
          .append('niv1', position.category || '')
          .append('niv2', position.subCategory || '')
          .append('niv3', position.subSubCategory || ''),
        withCredentials: true
      }
    );
  }



}
