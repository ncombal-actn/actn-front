import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY, BehaviorSubject, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '@env';

/**
 * Service pour fournir des prédictions par rapport à une recherche par mot clé liée au catalogue.
 */
@Injectable({
    providedIn: 'root'
})
export class CatalogueSearchPredictionService {

    source: Observable<CataloguePredictJSON>;

    public get searchString$(): Observable<string> {
        return this._searchString.asObservable();
    }

    public get searchString(): string {
        return this._searchString.value;
    }
    public set searchString(value: string) {
        this._searchString.next(value);
    }

    private _searchString = new BehaviorSubject<string>('');

    newSearch$ = new Subject<string>();

    constructor(private httpClient: HttpClient) {
        this.source = this.getCataloguePredictJSON();
    }

    /**
     *
     * @param searchString La chaîne de caractère à rechercher
     */
    getPredictions(searchString: string): Observable<PredictionResults> {
        const str = this.removeAccents(searchString);
        const keywords = str
            .toUpperCase()
            .split(' ')
            .filter(keyword => keyword.length >= 2);
        if (keywords.length) {


            return this.source.pipe(
                map(
                    source =>
                        ({
                            marques: new Set([
                                ...source
                                    .filter(produit =>
                                        keywords.reduce(
                                            (acc, keyword) =>
                                                produit.MARQUE.includes(keyword) ||
                                                acc,
                                            false
                                        )
                                    )
                                    .map(produit => produit?.MARQUE.toLocaleLowerCase() + ' ' + produit?.CATEGORIE.toLocaleLowerCase())
                            ]),
                            produits: source
                                .filter(produit =>
                                    keywords.reduce(
                                        (acc, keyword) =>
                                            produit.MARQUE.includes(keyword) ||
                                            produit.PROD.startsWith(keyword) ||
                                            produit.DESIGNATION.includes(keyword) ||
                                            acc,
                                        false
                                    )
                                )
                                .map(produit => ({
                                    reference: produit.PROD,
                                    designation: produit.DESIGNATION.toLocaleLowerCase(),
                                    poids: this.getPoids(produit, keywords)
                                }))
                                .sort((a, b) => b.poids - a.poids)
                        } as PredictionResults)
                )
            );
        } else {
            return EMPTY;
        }
    }

    /**
     * @returns Le contenu du fichier predict.json dans un observable de CataloguePredictJSON.
     */
    public getCataloguePredictJSON(): Observable<CataloguePredictJSON> {
        // EXECUTABLE QUE SUR LE SITE A CAUSE DU PROBLEME D ACCES
        if (environment.production) {
            return this.httpClient.get<CataloguePredictJSON>(`${environment.apiUrl}/predict.json`,
                {
                    withCredentials: true, responseType: 'json'
                });
        }
        else {
            return this.httpClient.get<CataloguePredictJSON>('../../assets/json/predict.json',
                {
                    withCredentials: true, responseType: 'json'
                });
        }
    }

    /**
     * Calcule le poids de la recherche dans les produits correspondants a la recherche
     * @param produit Un produit
     * @param keywords Une liste de mots-clés
     */
    public getPoids(produit: any, keywords: Array<string>) {
        let poids = 0;
        for (const keyword of keywords) {

            // Le poids peut augmenter si la recherche est contenu dans le nom de la marque
            if (produit.MARQUE.includes(keyword)) {
                poids += keyword.length;
            }

            // Ou dans la référence produit
            if (produit.PROD.includes(keyword)) {
                poids += keyword.length;
            }

            // Ou dans la désignation produit
            if (produit.DESIGNATION.toUpperCase().includes(keyword)) {
                poids += keyword.length;
            }
        }
        return poids;
    }

    /**
     * Supprime les accents d'une chaîne de caractère
     * @param str Une chaîne de caractères
     */
    public removeAccents(str: string): string {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    public emitNewCatalogueSearch(search: string)
    {
        this.newSearch$.next(search);
    }
}

/**
 * Ensemble de résultats du fichier predict.json correspondant à une chaîne de caractères donnée.
 * Utilisé pour le contenu des autocompletes liés au catalogue.
 */
export interface PredictionResults {
    marques: Set<string>;
    produits: [
        {
            reference: string;
            designation: string;
            poids: number;
        }
    ];
}

/**
 * Représente le contenu du fichier predict.json
 */
export type CataloguePredictJSON = [{
    MARQUE: string;
    MARQCODE: string;
    PROD: string;
    DESIGNATION: string;
    CATEGORIE: string;
    FAMILLE: string;
    REFFOUR: string;
}];
