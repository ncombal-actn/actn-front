import { CataloguePosition, Filtre } from './catalogue';
import { Observable } from 'rxjs';
import { Produit } from './produit';
import { User } from './user';

/** 
 * Objet regroupant paramètres de recherches
 */
export class Search {
    /** Position dans le catalogue de la recherche */
    position: CataloguePosition;
    /** Chaine de caractère de la recherche */
    search: string;
    /** Marque de la recherche */
    marque: string;
    /** Utilisateur connecté */
    user: User;

    constructor(position?: CataloguePosition, search?: string, marque?: string, user?: User) {
        this.position = position || new CataloguePosition();
        this.search = search || '';
        this.marque = marque || '';
        this.user = user || null;
    }

    /**
     * Renvoie si 'o' est absolument égal à cette recherche
     * @param o Search à comparer avec 'this'
     * @returns True si 'o' est strictement égal à 'this'
     */
    equals(o: Search): boolean {
        return o.position.category === this.position.category
            && o.position.subCategory === this.position.subCategory
            && o.position.subSubCategory === this.position.subSubCategory
            && o.search === this.search
            && o.marque === this.marque
            && o.user?.id === this.user?.id;
    }
}