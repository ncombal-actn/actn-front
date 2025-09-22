import { Produit } from '@/_util/models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from '@env';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class PrestationsService {

	get prestations(): Array<Produit> {
		return this._prestations.value;
	}
	get prestations$(): Observable<Array<Produit>> {
		return this._prestations.asObservable();
	}

	private _prestations = new BehaviorSubject<Array<Produit>>([]);

	constructor(
		private http: HttpClient
	) {
		this.http.get<Array<Produit>>(
			
			 `${environment.apiUrl}//ListeProduits.php?search=&marque=&niv1=SER&niv2=PRE&niv3=`,
			{
				withCredentials: true,
				responseType: 'json'
			})
			.pipe(take(1))
			.subscribe(prestations => this._prestations.next(prestations));
	}

	sendForm(form: FormGroup, prestations: Produit[]): Observable<boolean> {
		return this.http.post<boolean>(
			`${environment.apiUrl}/DemandePrestations.php`,
			{
				id: form.get('clientID').value,
				email: form.get('email').value,
				nom: form.get('nom').value,
				telephone: form.get('telephone').value,
				fonction: form.get('fonction').value,
				societe: form.get('societe').value,
				/* Prestation qui faut changer*/
				prestations: prestations,
				commentaires: form.get('commentaires').value,
			});
	}

	/*  getAllChoices(prestations: Array<Produit>): Array<Produit> {
		return prestations.reduce((acc, val) => acc.concat(val.choices.reduce((acc2, val2) => acc2.concat((val.label + '-' + val2.label).toLowerCase()), [])), []);
	}  */



}

export type Prestation = {
	icone: string,
	label: string,
	choices: [
		{
			label: string,
			description: string,
			prix: string | number;
		}
	]
};
