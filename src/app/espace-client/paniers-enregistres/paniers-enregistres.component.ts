import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { take, takeLast } from 'rxjs/operators';
import { Validators, FormBuilder, FormControl } from '@angular/forms';

import { Router } from '@angular/router';
import { CartService } from '@/_core/_services/cart.service';
import { ProduitService } from '@/_core/_services/produit.service';
import { RmaService } from '@/_core/_services/rma.service';
import {AuthenticationService} from "@core/_services";


@Component({
	selector: 'app-paniers-enregistres',
	templateUrl: './paniers-enregistres.component.html',
	styleUrls: ['./paniers-enregistres.component.scss']
})
export class PaniersEnregistresComponent implements OnInit {

	environment = environment;

	@Input() paniersSauvegardes = null;
	@Output() paniersSauvegardesChange = new EventEmitter();

	showDeletePopUp: number = -1;

	// index of the savedCart being edited
	editingIndex: number = -1;
	// [(ngModel)] input text for the new name of the savedCart being edited
	editedCartTitle: string = "";
	// index of the savedCart with an edit error
	editError: number = -1;

	indexOfSavedCartBeingAdded: number = -1;

	/*editSavedCartForm = this.fb.group({
		editedCartTitle: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9+_-]+$/)]]
	});*/

	constructor(
		private http: HttpClient,
		private cartService: CartService,
		private produitService: ProduitService,
		private rmaService: RmaService,
		private auth: AuthenticationService

	) { }

	ngOnInit()
	{
		if (this.paniersSauvegardes == null)
		{
			this.getSavedPaniers()
		}
	}

	editIndex(index: number): void
	{
		this.editingIndex = index;
		this.editedCartTitle = this.paniersSauvegardes[index].values[0].referencecommande;
		this.editError = -1;
	}

	cancelEdit(): void
	{
		this.editingIndex = -1;
		this.editedCartTitle = "";
		this.editError = -1;
	}

	confirmEdit(index: number)
	{
    const formatedCartTitle = this.rmaService.removeAccents(this.editedCartTitle);
		this.editError = -1;
		if (/^[a-zA-Z0-9 ]{1,25}$/.test(formatedCartTitle))
			{
				this.http
				.get(`${environment.apiUrl}/Majpanier.php`, {
					withCredentials: true,
					responseType: 'json',
					params: {
						nopanier : this.paniersSauvegardes[index].key,
						refcde: encodeURIComponent(formatedCartTitle)

					}
				})
				.pipe(takeLast(1))
				.subscribe(
					(ret) =>
					{
						this.getSavedPaniers();
					},
					(error) =>
					{

					}
				);
				this.cancelEdit();
			}
		else
		{

			this.editError = index;
		}

	}

	/**
	 *	Récupère la liste des paniers sauvegardés du client en session
	 * stocke la liste dans la variable 'paniersSauvegardes'
	 */
	getSavedPaniers()
	{
		/* GET LISTE DES PANIERS SAUVEGARDÉS */
		this.http
		.get(`${environment.apiUrl}/ListePaniers.php`, {
			withCredentials: true,
			responseType: 'json'
		})
		.pipe(takeLast(1))
		.subscribe(
			(ret) =>
			{
				// this.paniersSauvegardes = this.groupByArray(this.listePanier, 'numcommande');

				this.paniersSauvegardes = this.groupByPanier(ret, 'numcommande');
				this.paniersSauvegardesChange.emit(this.paniersSauvegardes);
			},
			(error) =>
			{

			}
		);
	}

	/**
	 * Regroupe les produits des paniers sauvegardés en paniers sauvegardés
	 */
	groupByPanier = function (xs, key)
	{
		return xs.reduce(
			function (rv, x)
			{
				const v = key instanceof Function ? key(x) : x[key];
				const el = rv.find((r) => r && r.key === v);
				if (el) {
					el.values.push(x);
				} else {
					rv.push({ key: v, values: [x] });
				}
				return rv;
			},
			[]
		);
	};
	/*outputSavedPanier()
	{

	}*/

	/**
	 * Ajoute les produits du panier sauvegardé à la position 'i' au panier actif
	 */

	// Bizare le pb viens du faite que l'on modifier pas  indexOfSavedCartBeingAdded
	addSavedCart(i: number, clearPreviousCart: boolean): void //= false
	{
		if (clearPreviousCart == true)
		{
			this.cartService.emptyCart();
		}

		this.cartService.addSavedCart(this.paniersSauvegardes[i].values);
		this.indexOfSavedCartBeingAdded = -1; // close popup
	}



	openAddPopup(index: number): void
	{


		// s'il n'y a pas de panier courant, ajoute directement le panier sauvegardé
		if (this.cartService.isEmpty())
		{


			this.addSavedCart(index, true)
		}
		else
		{

			this.indexOfSavedCartBeingAdded = index;
		}
	}
	closeAddPopup(): void
	{
		this.indexOfSavedCartBeingAdded = -1; // close popup
	}

	/**
	 * Supprime un panier de la liste des paniers sauvegardés
	 */
	deletePanier(numPanier, refPanier)
	{
		this.http
			.get(`${environment.apiUrl}/Deletepanier.php`, {
				withCredentials: true,
				responseType: 'json',
				params: {
					nopanier: numPanier
				}
			})
			.pipe(takeLast(1))
			.subscribe(
				(ret) => {


					for (let i = this.paniersSauvegardes.length - 1; i >= 0; i--) {
						if (this.paniersSauvegardes[i].values[0].numcommande == numPanier) {
							this.paniersSauvegardes.splice(i, 1);
							return (0);
						}
					}
					this.paniersSauvegardesChange.emit(this.paniersSauvegardes);
				},
				(error) => {

				}
			);
	}

	goToPageProduit(produitId :string): void
	{
		this.produitService.goToProduitById(produitId);
	}


}
