import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Adresse, Produit, Contact } from '@/_util/models';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@env';
import { FormGroup } from '@angular/forms';
import { AuthenticationService } from './authentication.service';
import { RmaService } from './rma.service';
import { LocalStorageService } from './localStorage/local-storage.service';
import { StorageService } from './storage.service';

/**
 * Service manipulant les utilisateurs dans un compte client
 */
@Injectable({ providedIn: 'root' })
export class UserService {

	get contacts$(): Observable<Contact[]> { return this._contacts$.asObservable(); }

	public contactGroupName = 'Contact';

	/** Observable de la liste des contacts d'un utilisateur */
	private _contacts$ = new BehaviorSubject<Contact[]>([]);
	/** Contact par défaut (en dur) */
	private _defaultContact = {
		nom: 'Service commercial',
		tel: '05 62 488 488',
		mail: '',
		telLink: '+33562488488'
	};

	constructor(
		private httpClient: HttpClient,
		public authService: AuthenticationService,
		public rmaService: RmaService,
		private storageService: StorageService,
		private localStorage: LocalStorageService
	) {
		this._parseContacts();
	}

	/** Liste des adresses, observable, résultat de la requete ListeAdresses.php */
	getAdresses(): Observable<Adresse[]> {
		return this.httpClient.get<Adresse[]>(`${environment.apiUrl}/ListeAdresses.php`,
			{ withCredentials: true }
		);
	}

	/** Liste des utilisateurs, observable, résultat de la requete ListeUtilisateurs.php */
	getClients(): Observable<any> {
		return this.httpClient.get<any>(`${environment.apiUrl}/ListeUtilisateurs.php`,
			{ withCredentials: true }
		);
	}

	/**
	 * Supression d'un utilisateur depuis son ID
	 * @param numInd ID de l'utilisateur à supprimer
	 */
	supprClients(numInd): Observable<any> {
		return this.httpClient
			.get<any>(`${environment.apiUrl}/IDutilisateur.php`,
				{
					withCredentials: true,
					params: {
						action: 'DEL',
						numindividu: numInd,
					}
				});
	}

	/**
	 * Mise à jour d'un utilisateur
	 * @param form FormGroup regroupant toutes les infos mises à jour de l'utilisateur
	 * @param numInd Numéro d'indentification de l'utilisateur
	 * @param numId ID du client
	 */
	updtClients(form: FormGroup, numInd: string, numId: string): Observable<any>
	{
		// console.warn("ID", numId);
		let password;
		let autoMailing;
		if (form.value.mdp) {
			password = form.value.mdp;
		} else {
			password = '';
		}
		if (form.value.mailing) {
			autoMailing = 'O';
		} else {
			autoMailing = 'N';
		}
		// console.warn("admin", form.value.admin);
		return this.httpClient
			.get<any>(`${environment.apiUrl}/IDutilisateur.php`,
				{
					withCredentials: true,
					params: {
						action: 'UPD',
						service: form.value.service,
						mail: form.value.mail,
						nom: this.rmaService.removeAccents(form.value.nom),
						tel: form.value.tel,
						droit: form.value.commande,
						mailling: autoMailing,
						pass: password,
						id: numId,
						numindividu: numInd,
						role: (form.value.admin ? "A" : '')
					}
				});
	}

	updtDiffClients(form1, form2, numInd): Observable<any> {
		let autoMailing;
		if (form1.value.mailing) {
			autoMailing = 'O';
		} else {
			autoMailing = 'N';
		}
		return this.httpClient
			.get<any>(`${environment.apiUrl}/IDutilisateur.php`,
				{
					withCredentials: true,
					params: {
						action: 'UPD',
						service: form1.value.service,
						mail: form1.value.mail,
						nom: this.rmaService.removeAccents(form1.value.nom),
						tel: form1.value.tel,
						droit: form1.value.commande,
						mailling: autoMailing,
						pass: form2.value.mdp,
						id: form2.value.ident,
						numindividu: numInd,
					}
				});
	}

	/**
	 * Créé et rajoute un Utilisateur à un compte client
	 * @param form FormGroup regroupant toutes les infos du nouvel l'utilisateur
	 * @param numId ID du client auquel rajouter le nouvel utilisateur
	 */
	addClients(form: FormGroup, numId: string): Observable<any> {
		let password;
		let autoMailing;
		if (numId === '') {
			password = '';
		} else {
			password = form.value.mdp;
		}
		if (form.value.mailing) {
			autoMailing = 'O';
		} else {
			autoMailing = 'N';
		}
		return this.httpClient
			.get<any>(`${environment.apiUrl}/IDutilisateur.php`,
				{
					withCredentials: true,
					params: {
						action: 'ADD',
						service: form.value.service,
						mail: form.value.mail,
						nom: this.rmaService.removeAccents(form.value.nom),
						tel: form.value.tel,
						droit: form.value.commande,
						mailling: autoMailing,
						pass: password,
						id: numId,
						numindividu: '',
						role: (form.value.admin ? "A" : '')
					}
				});
	}

	envoiNews(newsForm: FormGroup): Observable<any> {
		let newsACTN = 'Non';
		let newsAutre = 'Non';
		let desinscription = 'Non';
		if (newsForm.value.newsACTN === true) {
			newsACTN = 'Oui';
		}
		if (newsForm.value.newsAutre === true) {
			newsAutre = 'Oui';
		}
		if (newsForm.value.desinscription === true) {
			desinscription = 'Oui';
		}
		return this.httpClient
			.post<any>(`${environment.apiUrl}/IDNewsletter.php`,
				{
					name: newsForm.value.nom,
					mail: newsForm.value.mail,
					phone: newsForm.value.tel,
					societe: this.authService.currentUser.name,
					mailing: newsACTN,
					mailingpart: newsAutre,
					nomailing: desinscription,
					// categories : newsForm.value.categories,
				},
				{
					withCredentials: true,
					responseType: 'json',
				});
	}

	/** Récupère les informations profil en une Observable depuis une requète LogLecture.php */
	getProfil(): Observable<any> {
		return (
			this.httpClient.get(`${environment.apiUrl}/LogLecture.php`, { withCredentials: true, responseType: 'json' })
		);
	}

	/** Récupère la grille de transport en une Observable depuis une requète LogLecture.php */
	chargerGrille(): Observable<any> {
		return (
			this.httpClient.get(`${environment.apiUrl}/ListePort.php`, { withCredentials: true, responseType: 'json' })
		);
	}

	/** Récupère les categories en une Observable depuis une requète Filtresmarques.php */
	getCategories(): Observable<any> {
		return (
			this.httpClient.get(`${environment.apiUrl}/Filtresmarques.php`, { withCredentials: true, responseType: 'json' })
		);
	}

	/** Récupère les filtres depuis une position du catalogue et/ou une marque en une Observable depuis une requète FiltresmarqueDetail.php */
	getFiltres(codeMarque, codeNiv1?, codeNiv2?, codeNiv3?): Observable<any> {
		return (
			this.httpClient.get<any>(`${environment.apiUrl}/FiltresmarqueDetail.php`, {
				withCredentials: true,
				params: {
					marque: codeMarque,
					niv1: codeNiv1 ? codeNiv1 : ' ',
					niv2: codeNiv2 ? codeNiv2 : ' ',
					niv3: codeNiv3 ? codeNiv3 : ' ',
				}
			})
		);
	}

	/**
	 * Récupère une liste de produits depuis une liste de références, en une Observable avec la requète ProduitMultByID.php
	 * @param listRef Liste des références des produits à récupérer
	 */
	getProduits(listRef): Observable<Produit[]> {
		return (
			this.httpClient.post<Produit[]>(`${environment.apiUrl}/ProduitMultById.php`, {
				ref: listRef
			},
				{
					withCredentials: true,
					responseType: 'json',
				})
		);
	}

	getTxtDescription(gamme, marque): Observable<string> {
		if (environment.production) {
			return this.storageService.getStoredData('txtDescription', `${gamme}-${marque}`, () => {
				return (
					this.httpClient.get(`${environment.aideChoix + marque}-${gamme}.txt`, { withCredentials: true, responseType: 'text' })
				);
			});
		} else {
			return this.storageService.getStoredData('txtDescription', `${gamme}-${marque}`, () => {
				return (
					this.httpClient.get(`../../assets/aideChoix/${marque}-${gamme}.txt`, { withCredentials: true, responseType: 'text' })
				);
			});
		}
	}

	/**
	 * Indique si un fichier existe dans le dossier backend distant.
	 * @param fileLink Un lien relatif à partir de backend d'un fichier
	 * @returns true si le fichier existe, false sinon
	 */
	checkFileExists(fileLink: string): Observable<boolean> {
		return this.storageService.getStoredData('fileExists', fileLink, () => {
			return this.httpClient.get<boolean>(
				`${environment.apiUrl}/FileExists.php`,
				{
					withCredentials: true,
					params: {
						fileLink
					},
					responseType: 'json'
				});
		});
	}

	/**
	 * Extrait les contacts des données de l'utilisateur.
	 */
	private _parseContacts(): void {
		this.authService.currentUser$.subscribe(user => {
			//console.log("user", user);
			const contacts = [];
			if (user) {
				let i = 1;
				let contactFound = true;
				const keys = Object.keys(user);
				while (contactFound) {
					if (keys.find(key => key === `COMMERCIALNOM${i}`)) {
						if (user[`COMMERCIALNOM${i}`].length > 0) {
							contacts.push({
								nom: user[`COMMERCIALNOM${i}`],
								tel: user[`COMMERCIALTEL${i}`],
								mail: user[`COMMERCIALMAIL${i}`],
								telLink: '+33' + user[`COMMERCIALTEL${i}`].slice(1).replaceAll(' ', '')
							});
						}
					} else {
						contactFound = false;
					}
					i++;
				}
				if (contacts.length === 0) {
					contacts.push(this._defaultContact);
				}
				this.contactGroupName = user['COMMERCIALNOM'];
			} else {
				contacts.push(this._defaultContact);
			}
			this._contacts$.next(contacts);
			// console.log("contacts", contacts);
		});
	}
}
