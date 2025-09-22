import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Produit} from '@/_util/models/produit';
import {CataloguePosition} from '@/_util/models';
import {map, take} from 'rxjs/operators';
import {Search} from '@/_util/models/search';
import {SearchService} from './search.service';
import {AuthenticationService} from './authentication.service';
import {environment} from '@env';
import {StorageService} from './storage.service';

import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  constructor(
    private httpClient: HttpClient,
    private searchService: SearchService,
    private authenticationService: AuthenticationService,
    private storageService: StorageService,
    private router: Router
  ) {
  }

  /**
   * Récupère un produit via son id.
   * @param id L'id du produit à rechercher
   * @returns Observable<Produit> du produit trouvé
   */
  public getProduitById(id: string): Observable<Produit> {
    return this.httpClient.get<Produit>(`${environment.apiUrl}/ProduitByID.php`, {
      withCredentials: true,
      responseType: 'json',
      params: {
        ref: encodeURIComponent(id)
      }
    });
  }

  /**
   * Récupère des produit via leurs id.
   * @param references Un trableau d'id des produits à rechercher
   * @returns Observable<Produit> des produits trouvés
   */
  public getProduitsById(references: Array<string>): Observable<Array<Produit>> {
    return this.httpClient.post<Array<Produit>>(`${environment.apiUrl}/ProduitMultById.php`,
      {
        ref: references
      },
      {
        withCredentials: true,
        responseType: 'json',
      }
    );
  }

  /**
   * Indique le nombre de photos supplémentaire pour un produit.
   * @param ref La référence du produit
   * @returns Le nombre de photos supplémentaire
   */
  public getNombrePhotosProduitByID(ref: string): Observable<number> {
    return this.httpClient.get<number>(`${environment.apiUrl}/ProduitByIDGalerie.php`, {
      withCredentials: true,
      responseType: 'json',
      params: {
        ref: encodeURIComponent(ref)
      }
    });
  }

  /**
   * Récupère la description d'un produit à rechercher via son id.
   * @param id L'id du produit à rechercher
   */
  public getProduitDescriptionById(id: string): Observable<any> {
    return this.storageService.getStoredData('descriptions', id, () => {
      return this.httpClient.get(`${environment.apiUrl}/ProduitByIDdescription.php`, {
        withCredentials: true,
        responseType: 'json',
        params: {
          ref: encodeURIComponent(id)
        }
      });
    }, false);
  }

  /**
   * Récupère les produits depuis le backend en fonction des options données.
   * @param position La position (niveau actuel) dans le catalogue.
   * @param search La chaine de caractère pour la recherche par mots clés.
   * @param marque La marque pour limiter les produits à une seule marque.
   */
  public getProduits(position: CataloguePosition, search: string, marque: string): Observable<Produit[]> {
    const s = new Search(position, search, marque, this.authenticationService.currentUser);
    if (this.searchService.produitsARecherche(s)) {
      this.searchService.searchProduits = s;
      this.searchService.produits = this._getProduits(position, search, marque);
    }
    return this.searchService.produits;
  }

  /**
   * Récupère une liste de produits remplaçant un produit.
   * @param ref La référence du produit à rechercher
   */
  getProduitsRemplacement(ref: string): Observable<Produit[]> {
    return this.httpClient.get<Produit[]>(`${environment.apiUrl}/ProduitRemplacement.php`, {
      withCredentials: true,
      params: {
        ref: encodeURIComponent(ref)
      }
    });
  }

  getProduitsRenouvellement(ref: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${environment.apiUrl}/ProduitRenouvellement.php`, {
        withCredentials: true,
        params: {
            ref: encodeURIComponent(ref)
        }
    });
}

  /**
   * Récupère une liste de produits similaire un produit.
   * @param ref La référence du produit à rechercher
   */
  getProduitSimilaire(ref: string, limit?:boolean): Observable<Produit[]> {
    // return this.storageService.getStoredData('produitsRemplacement', ref, () => { encodeURIComponent(ref)
    return this.httpClient.get<Produit[]>(`${environment.apiUrl}/ProduitSimilaire.php`, {
      withCredentials: true,
      params: {
        ref: encodeURIComponent(ref),
        limit: limit
      }
    });
    // });
  }

  /**
   * Par defaut, renvoie la liste des produits actuellement en promotion
   * envoyer un string du code de la promotions pour changer le type de promotion recherché
   * P : promotion (default)
   * N : nouveautés
   * B : packs
   * D : destockage
   * K: reconditionnement
   */
  public getPromos(promoType:string , periode: string): Observable<Produit[]> {
    return this.storageService.getStoredData(promoType, '', () => {
      return this.httpClient.get<Produit[]>(`${environment.apiUrl}/ListeProduits.php`,
        {
          withCredentials: true,
          params: {promo: promoType, periode: periode}
        }
      );
    });
  }

  /**
   * Renvoie la liste des produits associés vente à un produit.
   * @param id
   */
  public getProduitsAssociationVente(id: string): Observable<Produit[]> {
    //return this.storageService.getStoredData('produitsAssocies', id, () => {
      return this.httpClient.get<Produit[]>(`${environment.apiUrl}/ProduitAssociationVente.php`,
        {
          params: new HttpParams().set('ref', id),
          withCredentials: true
        });
    //});
  }

  /**
   * Renvoie la liste des produits associés techniques à un produit.
   * @param ref La référence d'un produit
   */
  public getProduitsAssociationTechnique(ref: string): Observable<Produit[]> {
    //return this.storageService.getStoredData('produitsAssociesTechniques', ref, () => {
      return this.httpClient.get<Produit[]>(`${environment.apiUrl}/ProduitAssociationTechnique.php`,
        {
          params: new HttpParams().set('ref', ref),
          withCredentials: true
        });
    //});
  }

  /**
   * Mélange un tableau de manière aléatoire selon l'algorithme de Fisher-Yates.
   * @param array Tableau à mélanger
   */
  public shuffle(array: any[]): any[] {
    if (array == null) {
      return [];
    }
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Trier un tableau par prix croissant en enlevant les produits non dispo :3
   * @param objets
   */
  trierParPrixCroissant(objets): any[] {
    // Utilisez la méthode sort() pour trier le tableau en fonction du prix
    objets.sort((a, b) => a.prix - b.prix);

    // Utilisez la méthode sort() pour déplacer les produits en stock vers le début du tableau
    objets.sort((a, b) => {
      if (a.dispo === "En stock" && b.dispo !== "En stock") {
        return -1; // a doit venir avant b
      } else if (a.dispo !== "En stock" && b.dispo === "En stock") {
        return 1; // b doit venir avant a
      } else {
        return 0; // ne changez pas l'ordre
      }
    });

    // Renvoyez le tableau trié
    return objets;
  }

  /**
   * Renvoie le lien d'une image par défaut selon le type de produit.
   * @param produit Un produit
   */
  public errorImg(produit: Produit): string {
    if (produit.gabarit === 'V') {
      return (`${environment.produitVirtuelDefautImgUrl}`);
    }
    return (`${environment.produitDefautImgUrl}`);
  }

  /**
   * Renvoie le RouterLink d'un produit
   */
 /*  public lienProduit(produit: Produit): Array<string> {


    const addNiveau = (p, i) => {
      switch (i) {
        case 1:
          return p.niveaulibelle1 === '' ? '_' : p.niveaulibelle1;
        case 2:
          return p.niveaulibelle2 === '' ? '_' : p.niveaulibelle2;
        case 3:
          return (p.niveaulibelle3 === '' || p.niveaulibelle3 === '.') ? (p.niveaulibelle4 === '' ? '_' : p.niveaulibelle4) : p.niveaulibelle3;
      }
    };
    return ['/catalogue', addNiveau(produit, 1), addNiveau(produit, 2), addNiveau(produit, 3), produit.reference];
 
  } */

    
 public lienProduit(produit: Produit): Array<string> {
  const addNiveau = (p: Produit, i: number): string => {
    let libelle = '';
    switch (i) {
      case 1:
        libelle = p.niveaulibelle1 === '' ? '_' : p.niveaulibelle1;
        break;
      case 2:
        libelle = p.niveaulibelle2 === '' ? '_' : p.niveaulibelle2;
        break;
      case 3:
        libelle = (p.niveaulibelle3 === '' || p.niveaulibelle3 === '.')
          ? (p.niveaulibelle4 === '' ? '_' : p.niveaulibelle4)
          : p.niveaulibelle3;
        break;
    }
    return this.removeAccents(libelle);
  };
return [
    '/catalogue',
    addNiveau(produit, 1),
    addNiveau(produit, 2),
    addNiveau(produit, 3),
    produit.reference
  ];
}


 /** On normalize les urls pratique quand on génére la redirection depuis le slider des produits*/
  private removeAccents(value: string): string {
    if (value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }else{
      return ''
    }
}

  /**
   * Fait naviguer jusqu'à la page du produit dont on donne l'URL
   * @param produitId reference du produit duquel on veut naviguer jusqu'à la page
   * @returns void
   */
  public goToProduitById(produitId: string): void {
    this.getProduitById(produitId)
      .pipe(take(1))
      .subscribe((ret) => {
        this.router.navigateByUrl(
          String(this.lienProduit(ret))
            .replace(/,/g, '/')
        );
      });
  }

  public getFiltresMarques(): Observable<any> {
    return this.storageService.getStoredData('filtresmarques', 'filtresmarques', () => {
      return this.httpClient.get<any>(`${environment.apiUrl}/FiltresMarques.php`, {
        withCredentials: true,
        responseType: 'json'
      });
    });
  }

  public getFiltresMarqueOf(marque: string, niv1: string, niv2: string, niv3 = ''): Observable<any> {
    return this.storageService.getStoredData('filtresmarques', `${marque + niv1 + niv2 + niv3}`, () => {
      return this.httpClient.get<any>(`${environment.apiUrl}/FiltresmarqueDetail.php`, {
        withCredentials: true,
        responseType: 'json',
        params: {
          marque: encodeURIComponent(marque),
          niv1: encodeURIComponent(niv1),
          niv2: encodeURIComponent(niv2)
        }
      });
    });
  }

  public getFilteredProduits(position: CataloguePosition, filtres: Object): Observable<Produit[]> {
    return this.httpClient.get<Produit[]>(`${environment.apiUrl}/ListeProduits.php`,
      {
        params:
          {
            niv1: position.category,
            niv2: position.subCategory,
            niv3: position.subSubCategory
          },
        withCredentials: true
      })
      .pipe(take(1));
  }

  /**
   * Concatène une liste de chaîne en une chaine unique.
   * @param strings La liste de chaine à concaténer
   */
  fullString(strings: Array<string>): string {
    let s = ' ';
    strings.forEach(desc => s += desc);
    s = s.replace(/ +(?= )/g, '').trim();   // supprime les doubles espaces

    s = s.replace(/§/g, "\n ●\t");
    //replace(/(?!^ *§)[^§]*§ */g, '\n ●\t');

    s = s.replace(/^\n/g, '');
    return s;
  }

  private _getProduits(position: CataloguePosition, search: string, marque: string): Observable<Produit[]> {
    return this.httpClient.get<Produit[]>(`${environment.apiUrl}/ListeProduits.php`,
      {
        params: new HttpParams().set('search', search || '')
          .append('marque', marque || '')
          .append('niv1', position.category || '')
          .append('niv2', position.subCategory || '')
          .append('niv3', position.subSubCategory || ''),
        withCredentials: true
      })
      .pipe(
        map((produits) =>
          produits.map(produit => {
            if (produit['erreur']) {
              const erreur: Produit = new Produit();
              erreur.designation = produit['erreur'][0] + produit['erreur'].slice(1).toLowerCase();
              return erreur;
            } else {
              // Filtre les critères dynamiques des produits, supprime les critères vides.
              let i = 1;
              while (produit['criterelibelle' + i] !== undefined) {
                if (!produit['criterelibelle' + i].length) {
                  delete produit['criterelibelle' + i];
                  delete produit['criterevalue' + i];
                }
                i++;
              }
              return produit;
            }
          })
        ))
  }

}
