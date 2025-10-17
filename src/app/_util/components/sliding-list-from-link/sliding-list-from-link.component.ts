import { Component, OnInit, Input } from '@angular/core';
import { ProduitService } from '@core/_services/produit.service';
import { CatalogueService } from '@core/_services/catalogue.service';
import { Produit, CataloguePosition } from '@/_util/models';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '@env';

import { ActivatedRoute, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import {TitleWLineComponent} from "@/_util/components/title-w-line/title-w-line.component";
import {SlidingListeComponent} from "@/_util/components/sliding-liste/sliding-liste.component";

@Component({
  selector: 'app-sliding-list-from-link',
  standalone: true,
  templateUrl: './sliding-list-from-link.component.html',
  imports: [
    TitleWLineComponent,
    SlidingListeComponent
  ],
  styleUrls: ['./sliding-list-from-link.component.scss']
})
export class SlidingListFromLinkComponent implements OnInit {

	@Input() catalogueLink: string
		//= "http://localhost:4200/catalogue/Vid%C3%A9o/Cam%C3%A9ras%20IP/unique?&Disponibilit%C3%A9=Oui&Antivandale=oui&IR%20int%C3%A9gr%C3%A9=oui&Utilisation%20ext%C3%A9rieure=oui&Marque=HIKVISION&Marque=D-Link"; // 37
		//= "http://localhost:4200/catalogue/Vid%C3%A9o/Cam%C3%A9ras%20IP/unique?&Antivandale=oui&IR%20int%C3%A9gr%C3%A9=oui&Utilisation%20ext%C3%A9rieure=oui&Marque=HIKVISION&Marque=D-Link"; // 94
		// = "http://localhost:4200/catalogue/S%C3%A9curit%C3%A9/Monitoring%20de%20Salle/unique?&Condensation%20%28%C2%B0C%29=oui&Marque=KENTIX"; // 17
	@Input() cataloguePosition: CataloguePosition;
	/*("Câblage", "Fibre Optique", "Câbles FO")*//*("Cybersécurité", "Firewalls", "Accessoires")/*("Sécurité", "Alarme intrusion", "Acc.Filaires")*/

	// Uniquement pour la liste des produits
	@Input() title: string = '';
	@Input() random: boolean = false;
	@Input() maxLength: number = null; // coupe la liste à un maximum de produit donné, pas de limite si null ou 0

	urlArgLabels: Array<string> = [];
	urlArgValues: Array<Array<string>> = [];

	// Différents type de fonctionnement pour la liste, CHANGE RADICALEMENT LE COMPORTEMENT
	type: string = 'produit';

	filtres:	string[];

	produits:	Produit[] = null;
	filteredProduits: Produit[] = new Array<Produit>();

	environment = environment;

	resolvedCatalogue$: Observable<any> = null;

	constructor(
		private produitService: ProduitService,
		private catalogueService: CatalogueService,
		/////////////////////////////////////
		// private catalogueResolverService: CatalogueResolverService
		/////////////////////////////////////
	) { }

	ngOnInit(): void
	{
    const url: string = decodeURI(this.catalogueLink);
    const linkAndSearch: Array<string> = url.split("?");

    const links: Array<string> = linkAndSearch[0].split("/");
		// POSITION DANS LE CATALOGUE & PRODUITS
		this.processCataloguePosition(links);

		if (linkAndSearch[1]) {
      const searchs: Array<string> = linkAndSearch[1].split("&");
			// ARGUMENTS D'URL & FILTRES
			this.processCatalogueFilters(searchs);
		}

		////////////////////////////////////////////
/*
		const tree: UrlTree = this.router.parseUrl(this.catalogueLink);
		var arsUrl: UrlSegment[];
		var arsParams: Params;
		var arsQueryParams: Params;
		var fragment: Params;
	    // const g: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
    	// const s: UrlSegment[] = g.segments;

		var routeSnap: ActivatedRouteSnapshot = new ActivatedRouteSnapshot(arsUrl, arsParams, arsQueryParams);
*/
		////////////////////////////////////////////


		// get Products
		this.resolvedCatalogue$ =  this.resolveCatalogue();

		this.resolvedCatalogue$.pipe(take(1)).subscribe((ret) =>
			{

				ret.subscribe((data)=>{
					this.produits = data;
					// FILTRER LES PRODUITS
					this.filterProducts();
				});
			},
			(error) => { }
		);
	}

	processCataloguePosition(links: Array<string>): void
	{
		// POSITION DANS LE CATALOGUE & PRODUITS
		// enlève du tableau tout ce qu'il y a avant "catalogue" inclu
		links.splice(0, (links.indexOf("catalogue") + 1));
		// enlève du tableau toute case == "unique"
		while (links.indexOf("unique") != -1) {
			links.splice(links.indexOf("unique"), 1);
		}
		// nouveau cataloguePosition + initialisation
		this.cataloguePosition = new CataloguePosition();
		if (links[0]) {
			this.cataloguePosition.category = links[0];
			if (links[1]) {
				this.cataloguePosition.subCategory = links[1];
				if (links[2]) {
					this.cataloguePosition.subSubCategory = links[2];
				}
			}
		}
	}
	processCatalogueFilters(searchs: Array<string>): void
	{
		// remove empty array cells
		searchs = this.removeNullFromArray(searchs);
		//
    let itemCount: number = 0;
    let loop: Array<string>;
    let indexOf: number = -1;
    for (let i = searchs.length - 1; i >= 0; i--) {
			loop = searchs[i].split('=');
			indexOf = this.urlArgLabels.indexOf(loop[0]);

			if (indexOf == -1)
			{
				this.urlArgLabels.push(loop[0]);
				this.urlArgValues.push(new Array());
				this.urlArgValues[itemCount].push(loop[1]);
				++itemCount;
			}
			else
			{
				this.urlArgValues[indexOf].push(loop[1]);
			}
		}
	}

	resolveCatalogue(): Observable<any>
	{
		return this.catalogueService.generateStructure()
		.pipe(
			take(1),
			map(
				(v) =>
				{
          let ids = [];
          const niv1 = this.decodeIfNotNull(this.cataloguePosition.category == '' ? null : this.cataloguePosition.category);
                    const niv2 = this.decodeIfNotNull(this.cataloguePosition.subCategory == '' ? null : this.cataloguePosition.subCategory);
                    const niv3 = this.decodeIfNotNull(this.cataloguePosition.subSubCategory == '' ? null : this.cataloguePosition.subSubCategory);
					const labels = [].concat(niv1 ?? []).concat(niv2 ?? []).concat(niv3 ?? []);
					ids = this.catalogueService.findIds(labels);
          const position = {category: ids?.[0] ?? '', subCategory: ids?.[1] ?? '', subSubCategory: ids?.[2] ?? ''};

		            return position;
	        	}
	    	)
        )
        .pipe(
        	take(1),
        	map(
        		(position) =>
	        	{
              let search = null;
              if (this.urlArgLabels.includes("search"))
	        		{
	        			search = this.urlArgValues[this.urlArgLabels.indexOf("search")][0];
	        		}
		            return (this.produitService.getProduits(position, search, null));
	        	}
        	)
        );
	}

	filterProducts(): void
	{
    const tempFilteredProduits = new Array<Produit>();
    let valid: boolean = true;


    for (let i = this.produits.length - 1; i >= 0; i--) // pour chaque produit
		{
			valid = true;
			for (let j = this.urlArgLabels.length - 1; j >= 0; j--) // pour chaque label de filtre par produit
			{
				if (this.urlArgLabels[j] != "search") { // s'il y a "seach" comme filtre, on ne le compare pas avec les criteres des produit
					if (this.productDontHaveFilterInItsCritere(this.produits[i], this.urlArgLabels[j], this.urlArgValues[j]))
					{
						valid = false;
						break;
					}
				}
			}

			if (valid) // si le produit correspond aux filtres
			{
				tempFilteredProduits.push(this.produits[i]); // on l'ajoute à la liste finale
			}
		}

		this.filteredProduits = tempFilteredProduits;
		this.sortProductListByPriceAndDispo(this.filteredProduits);
		if (this.maxLength) // cap la longueur de la liste de produits si maxLength à été renseigné
		{
			this.filteredProduits = this.filteredProduits.slice(0, this.maxLength);
		}
	}

	productDontHaveFilterInItsCritere(produit: Produit, filtreLibelle: string, filtreValues: Array<string>): boolean
	{

		if (filtreLibelle == "Marque") // Libelle de filtre 'Marque'
		{
			if (filtreValues.indexOf(produit["marquelib"]) != -1) // si le critère du produit contient au moins une des valeurs filtres
			{
				return (false); // trouvé la marque
			}
			else
			{
				return (true); // pas trouvé la marque
			}
		}
		else if (filtreLibelle == "Famille") // Libelle de filtre 'Famille'
		{
			if (filtreValues.indexOf(produit["niveaucode2"]) != -1) // si le critère du produit contient au moins une des valeurs filtres
			{
				return (false); // trouvé la disponibilité
			}
			else
			{
				return (true);// pas trouvé la disponibilité
			}
		}
		else if (filtreLibelle == "Sous-Famille") // Libelle de filtre 'Famille'
		{
			if (filtreValues.indexOf(produit["niveaucode3"]) != -1) // si le critère du produit contient au moins une des valeurs filtres
			{
				return (false); // trouvé la disponibilité
			}
			else
			{
				return (true);// pas trouvé la disponibilité
			}
		}
		else if (filtreLibelle == "Disponibilité") // Libelle de filtre 'Disponibilité'
		{
			if (filtreValues.indexOf(produit["dispo"]) != -1) // si le critère du produit contient au moins une des valeurs filtres
			{
				return (false); // trouvé la disponibilité
			}
			else
			{
				return (true);// pas trouvé la disponibilité
			}
		}
		else // Libelle de filtre général
		{
			for (let i = 1; i <= 20; i++) // boucler dans les 20 critères / pour tout les criteres du produit
			{
				if (produit['criterelibelle'+i] == filtreLibelle) // si le critère existe
				{
					if (filtreValues.indexOf(produit['criterevalue'+i]) != -1) // si le critère du produit contient au moins une des valeurs filtres
					{
						return (false); // trouvé le critère
					}
					else
					{
						return (true); // pas trouvé le critère
					}
				}
			}
		}
		return (true); // le critère qu'on essaye de trouver n'existe pas dans ce produit
	}

	sortProductListByPriceAndDispo(productList: Produit[]): void
	{
		productList.sort(
			(produitA, produitB): number => // fonction callback de comparaison
			{
				if ( (produitA.qteStock1 > 0) && (produitB.qteStock1 > 0) ) // si les deux produits ont du stock
				{
					return (produitA.prix - produitB.prix); // tri par prix
				}
				else // si au moins un des deux produits n'a pas de stock
				{
					if ( produitA.qteStock1 == produitB.qteStock1 ) { // si les deux produits n'ont pas de stock
						return (produitA.prix - produitB.prix); // tri par prix
					} if ( produitA.qteStock1 <= 0 ) { // produitA n'a pas de stock
						return (1);
					} else /*if ( produitB.qteStock1 <= 0 )*/ { // produitB n'a pas de stock
						return (-1);
					}
				}
			}
		);
	}


	decodeIfNotNull = (str: string) => {
		return str != null ? decodeURI(str) : str;
	};

	removeNullFromArray(arr: Array<string>): Array<string>
	{
    let i: number = 0;
    while (i < arr.length)
		{
			while ((i < arr.length) && (!arr[i]))
			{
				arr.splice(i, 1);
			}
			++i;
		}
		return (arr);
	}

}
