import { Produit } from '@/_util/models/produit';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, CartService, StorageService } from '@core/_services';
import { LoadingService } from '@core/_services/loading.service';
import { ProduitService } from '@core/_services/produit.service';
import { environment } from '@env';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, skip, take } from 'rxjs/operators';
import { Configuration } from './configuration.model';

@Injectable({
	providedIn: 'root'
})
export class ConfigurateurService {

	public get apiLink(): string { return this._apiLink; }

	public get loading(): boolean { return this._loading.value; }
	public get loading$(): Observable<boolean> { return this._loading.asObservable(); }

	public get modeles(): Modele[] { return this._modeles; }

	public get produits(): Produit[] { return this._produits; }
	public set produits(value: Produit[]) { this._produits = value; }

	public get marque(): string { return this._marque; }

	/** La liste des catégories et leur libellés */
	public categories = [
		{ name: 'Boitier', value: 'Pack boitier + protection' },
		{ name: 'Licence', value: 'Licences' },
		{ name: 'Service', value: 'Services' },
		{ name: 'Equipement', value: 'Équipement additionnel' }
	];

	/** Les textes associés aux différents éléments du configurateur */
	public textes: Map<string, Map<string, string>> = null;
	/** La solution en cours de configuration */
	public configuration: Configuration = null;
	/** La liste des options disponibles */
	public options = new Array<Option>();
	/** La liste des gammes de la marque */
	public gammes = new Set<string>();
	/** Les taux de locations */
	public tauxLocation: { taux: string; mois: string }[] = [];

	/** Observable qui sert à forcer un rechargement */
	public reload$ = new Subject<void>();
	/** Observable qui indique qui à effectuer une modification de la configuration (inutilisée ?) */
	public configurationChange = new Subject<string>();
	/** La liste des produits à ajouter à la configuration en cours une fois qu'elle est créée */
	public pendingProducts: { option: string; quantite: number }[] = [];
	public pendingName = '';
	public pendingCommentaires = '';

	/** Observable qui indique si le configurateur est en cours de chargement */
	protected _loading = new BehaviorSubject<boolean>(false);
	/** La liste des modèles de la marque */
	protected _modeles = new Array<Modele>();
	/** La liste des tous les produits (modèles, options, équipements additionnels, etc.) */
	protected _produits: Produit[] = [];

	/** Le lien vers l'api de la marque */
	protected _apiLink = '';
	/** Le nom de la marque */
	protected _marque = '';

	protected _equipementsAdditionnelsCount$ = new Subject<void>();
	protected _loadingDoneCount = 0;
	protected _totalLoad = 6;

	constructor(
		protected http: HttpClient,
		protected produitService: ProduitService,
		protected authService: AuthenticationService,
		protected cartService: CartService,
		protected router: Router,
		protected storageService: StorageService,
		protected loadingService: LoadingService
	) { }

	protected _loadingDone(): void {
		this._loadingDoneCount++;
		this.loadingService.progressBarState = { isShowing: true, progression: this._loadingDoneCount * 100 / this._totalLoad, texte: `Chargement du configurateur : ${this._loadingDoneCount}/${this._totalLoad}` };
	}

	protected load(): void {
		this._loading.next(true);
		this._loadingDoneCount = 0;
		this.loadingService.progressBarState = { isShowing: true, progression: 0, texte: `Chargement du configurateur : ${this._loadingDoneCount}/${this._totalLoad}` };
		this.loadTexts().pipe(take(1)).subscribe(
			texts => {
				this.textes = texts;
			},
			(error) => {
			},
			() => {
				this._loadingDone();
			}
		);
		this.loadHeaders().pipe(take(1)).subscribe(
			headers => {
				const loading = new Subject<void>();
				const headerCount$ = new Subject<void>();
				headerCount$
				.pipe(skip(headers.length - 1), take(1))
				.subscribe(
					() => this._loadingDone(),
					(error) => {
						console.error("Error in 'ConfigurateurService' load() : headerCount$.subscribe() failed :", error);
					}
				);

				headers.forEach(header => {
					this.loadData(header.NIV1, header.NIV2).pipe(take(1)).subscribe(data => {
						headerCount$.next();
						if (data.length > 0) {
						data.forEach(d => {
							
							
							const acc: Option = {};
							for (let i = 1; i <= 20; i++) {
								acc[header[`critere${String(i).padStart(2, '0')}`]] = { value: d[`val${String(i).padStart(2, '0')}`], type: header[`attribut${String(i).padStart(2, '0')}`], sequence: header[`sequence${String(i).padStart(2, '0')}`] };
							}
							
							
							acc['NIV1'] = { value: d['NIV1'], type: '', sequence: '0' };
							acc['NIV2'] = { value: d['NIV2'], type: '', sequence: '0' };
							acc['NIV3'] = { value: d['NIV3'], type: '', sequence: '0' };
							acc['NIV4'] = { value: d['NIV4'], type: '', sequence: '0' };
							acc['NIV5'] = { value: d['NIV5'], type: '', sequence: '0' };
							acc['marque'] = { value: d['marque'], type: '', sequence: '0' };
							acc['marquelibelle'] = { value: d['marquelibelle'], type: '', sequence: '0' };
							acc['liste'] = { value: d['valliste'], type: '', sequence: '0' };
							acc['produit'] = { value: d['produit'], type: '', sequence: '0' };
							acc['Durée'].value = acc['Durée'].value === '9999 mois' ? 'Perpétuel' : acc['Durée'].value;
							acc['group'] = { value: header.NIV2 === 'FIR' ? 'Boitier' : 'Licences', type: '', sequence: '0' };
							this.options.push(acc);
						});
					}
						// Charge les modèles de firewall
						this.loadModeles(header, data).pipe(take(1)).subscribe(modeles => {
							this._modeles = this._modeles.concat(modeles);
							this.gammes = new Set([...this.gammes].concat([...this.loadGammes(data)]));
							loading.next();
						});
					});
				});
				// Une fois que tout est chargé, complète les données
				loading.pipe(skip(headers.length), take(1)).subscribe(
					() => {
						this.produitService.getProduitsById(this.options.map(option => option.produit.value)).pipe(take(1)).subscribe(produits => {
							this.updateProduits(produits);
							this._loadingDoneCount = 0;
							this.loadingService.progressBarState = { isShowing: false, progression: 0, texte: '' };
							this._loading.next(false);
						});
					},
					(error) => {},
					() => {
						this.authService.currentUser$.subscribe(() => {
							this.produitService.getProduitsById(this.options.map(option => option.produit.value)).pipe(take(1)).subscribe(produits => {
								this.updateProduits(produits);
								this.reload$.next();
							});
						});
					});
				loading.next();
			},
			(error) => {
				console.error("Error in 'ConfigurateurService' load() : loadHeaders().subscribe() failed :", error)
			},
			() => {
				this._loadingDone();
			});
		this.loadLocation().pipe(take(1)).subscribe(
			data => this.tauxLocation = data.reverse(),
			(error) => {
			}
		);
	}

	/**
	 * Charge les lignes d'en-têtes de header du configurateur, filtré par marque.
	 */
	protected loadHeaders(): Observable<AssociativeArray[]> {
		return this.storageService.getStoredData('configurateurs', 'headers', () => {
			return this.http.get<AssociativeArray[]>(
				environment.apiUrl + 'FiltresConfigurateur.php',
				{ withCredentials: true }
			)
		}).pipe(
			map(headers => headers = headers.filter(header => header.marque === this._marque))
		);
	}

	/**
	 * Charge les données associés à une ligne d'en-tête.
	 *
	 * @param niv1 Le niveau 1 fournit par l'en-tête
	 * @param niv2 Le niveau 2 fournit par l'en-tête
	 */
	protected loadData(niv1: string, niv2: string): Observable<AssociativeArray[]> {
		return this.storageService.getStoredData('configurateurs', this.marque + niv1 + niv2, () => {
			return this.http.get<AssociativeArray[]>(
				environment.apiUrl + 'FiltresConfigurateurDetail.php',
				{
					withCredentials: true,
					params: {
						marque: this._marque,
						niv1,
						niv2
					}
				}
			)
		});
	}

	/**
	 * Extrait une liste de modèles d'un couple (en-tête, valeurs).
	 * @param header Une ligne d'en-têtes de colonnes
	 * @param data Les valeurs de colonnes associées
	 * @returns Une liste de modèles
	 */
	protected loadModeles(header: AssociativeArray, data: AssociativeArray[]): Observable<Modele[]> {
		const ret = new Subject<Modele[]>();
		const modelesNames = [...new Set(data.map(e => e.val02))].filter(e => e !== '');
		const modeles = new Array<Modele>();
		const niv = ((): { code: string; label: string }[] => { const acc = new Array<{ code: string; label: string }>(); for (let i = 1; i <= 5; i++) acc.push({ code: header[`NIV${i}`], label: header[`libelleniv${i}`] }); return acc })();
		if (modelesNames.length > 0) {
			modelesNames.forEach(modeleName => {
				const l = modeles.push(new Modele()) - 1;
				const m = data.find(e => e.val02 === modeleName);
				modeles[l].produit = modeleName;
				modeles[l].reference = m.produit;
				modeles[l].marque = { label: header.marquelibelle, code: header.marque };
				modeles[l].niv = niv;
				modeles[l].crits = (() => { const acc: { [key: string]: { value: string, type: string } } = {}; for (let i = 1; i <= 20; i++) acc[header[`critere${String(i).padStart(2, '0')}`]] = { value: m[`val${String(i).padStart(2, '0')}`], type: header[`attribut${String(i).padStart(2, '0')}`] }; return acc })();
				this.loadEquipementAdditionnel(modeles[l]);
				this.loadService(modeles[l]);
			});
			this._equipementsAdditionnelsCount$.pipe(skip((modelesNames.length - 1) * 2), take(1)).subscribe(
				() => {
					this.produitService.getProduitsById(modeles.map(e => e.reference)).pipe(take(1)).subscribe(
						produits => {
							produits.forEach(produit => {
								const m = modeles.find(modele => modele.reference === produit.reference);
								this.produitService.getProduitDescriptionById(produit.reference)
									.pipe(take(1))
									.subscribe(description => m.details = description.filter(desc => desc.type === 'SPE').map(desc => desc.description));
								m.photo = produit.photo;
								m.pdfs = produit['pdfs'];
								m.description = this.textes?.get(m.crits['Gamme'].value)?.get(m.produit);
							});
							ret.next(modeles);
						},
						() => {
							// Ne rien faire
						},
						() => {
							this._loadingDone();
						});
				},
				() => {
					// Ne rien faire
				},
				() => {
					this._loadingDone();
				});
		} else {
			setTimeout(() => ret.next(modeles));
		}
		return ret.asObservable();
	}

	/**
	 * Charge les équipements additionnels d'un pare-feu
	 * @param modele Le modèle du pare-feu
	 */
	protected loadEquipementAdditionnel(modele: Modele): void {
		const equipements = new BehaviorSubject<Produit[]>([]);
		modele.equipements = equipements;
		this.produitService.getProduitsAssociationTechnique(modele.reference).pipe(take(1)).subscribe(
			produits => {
				this._equipementsAdditionnelsCount$.next();
				equipements.next(produits);
				produits.forEach(produit => {
					if (!this.options.find(o => o.produit.value === produit.reference)) {
						const option = {};
						option['Ligne commerciale'] = { value: 'Not A Licence', type: '', sequence: '0' };
						option['Gamme'] = { value: 'Not A Licence', type: '', sequence: '0' };
						option['liste'] = { value: '', type: '', sequence: '0' };
						option['Type de matèriel'] = { value: produit['niveaulibelle3'] || produit['niveaulibelle4'], type: '', sequence: '0' };
						option['NIV1'] = { value: produit['niveaucode1'], type: '', sequence: '0' };
						option['NIV2'] = { value: produit['niveaucode2'], type: '', sequence: '0' };
						option['NIV3'] = { value: produit['niveaucode3'], type: '', sequence: '0' };
						option['NIV4'] = { value: produit['niveaucode4'], type: '', sequence: '0' };
						option['NIV5'] = { value: produit['niveaucode5'], type: '', sequence: '0' };
						option['marque'] = { value: produit.marque, type: '', sequence: '0' };
						option['marquelibelle'] = { value: produit.marquelib, type: '', sequence: '0' };
						option['produit'] = { value: produit.reference, type: '', sequence: '0' };
						option['group'] = { value: 'Équipement additionnel', type: '', sequence: '0' };
						this.options.push(option);
					}
				});
			});
	}

	/**
	 * Charge les services d'un pare-feu
	 * @param modele Le modèle du pare-feu
	 */
	protected loadService(modele: Modele): void {
		const services = new BehaviorSubject<Produit[]>([]);
		modele.services = services;
		this.produitService.getProduitsAssociationVente(modele.reference)
			.pipe(
				take(1),
				map(produits => produits = produits.filter(produit => produit.marque === 'PRES')))
			.subscribe(
				produits => {
					this._equipementsAdditionnelsCount$.next();
					services.next(produits);
					produits.forEach(produit => {
						if (!this.options.find(o => o.produit.value === produit.reference)) {
							const option = {};
							option['Ligne commerciale'] = { value: 'Not A Licence', type: '', sequence: '0' };
							option['Gamme'] = { value: 'Not A Licence', type: '', sequence: '0' };
							option['liste'] = { value: '', type: '', sequence: '0' };
							option['Type de matèriel'] = { value: produit['niveaulibelle3'] || produit['niveaulibelle4'], type: '', sequence: '0' };
							option['NIV1'] = { value: produit['niveaucode1'], type: '', sequence: '0' };
							option['NIV2'] = { value: produit['niveaucode2'], type: '', sequence: '0' };
							option['NIV3'] = { value: produit['niveaucode3'], type: '', sequence: '0' };
							option['NIV4'] = { value: produit['niveaucode4'], type: '', sequence: '0' };
							option['NIV5'] = { value: produit['niveaucode5'], type: '', sequence: '0' };
							option['marque'] = { value: produit.marque, type: '', sequence: '0' };
							option['marquelibelle'] = { value: produit.marquelib, type: '', sequence: '0' };
							option['produit'] = { value: produit.reference, type: '', sequence: '0' };
							option['group'] = { value: 'Service', type: '', sequence: '0' };
							this.options.push(option);
						}
					});
				});
	}

	/**
	 * Extrait la liste des gammes.
	 * @param values Les valeurs de colonnes
	 * @returns La liste des gammes
	 */
	protected loadGammes(values: Array<{ [key: string]: string }>): Set<string> {
		return new Set(values.map(e => e.val01).filter(e => e !== ''));
	}

	/**
	 * Charge les différents textes à associer aux différents éléments du configurateur.
	 */
	protected loadTexts(): Observable<Map<string, Map<string, string>>> {
		return this.http.get<Map<string, Map<string, string>>>(
			environment.apiUrl  + 'texts.php',
			{ withCredentials: true }
		).pipe(
			map((data: unknown) => {
				const res = new Map<string, Map<string, string>>();
				for (const [gamme, details] of Object.entries(data)) {
					res.set(gamme, new Map<string, string>());
					for (const [element, detail] of Object.entries(details)) {
						res.get(gamme).set(element, detail as string);
					}
				}
				return res;
			})
		);
	}

	/**
	 * Charge les taux de location.
	 */
	protected loadLocation(): Observable<{ taux: string, mois: string }[]> {
		return this.http.get<{ taux: string; mois: string }[]>(
			environment.apiUrl + 'getTauxLocation.php',
			{
				withCredentials: true,
				responseType: 'json'
			}
		)
	}

	/**
	 * Met à jour les produits et le prix des options.
	 *
	 * @param produits Une liste de produits
	 */
	updateProduits(produits: Produit[]): void {
		this.options.forEach(d => d.prix = { value: produits.find(p => p.reference === d.produit.value)?.prix.toString() ?? '', type: '', sequence: '0' });
		this._produits = produits;
	}

	getTexte(gamme: string, type: string): string {
		return this.textes.get(gamme)?.get(type) ?? '';
	}

	retrieveOptions(modele: string, categorie: string): Option[] {
		return this.options.filter(option =>
			(option['liste'].value.split(', ').some(m => m === modele) || option['liste'].value === 'TOUS' || option['Ligne commerciale'].value === modele)
			&& (option['Type de matèriel'].value.split('#')[1] ?? option['Type de matèriel'].value) === categorie
		).sort((o1, o2) => +o1.prix.value - +o2.prix.value);
	}

	/**
	 * Convertit un prix HT en prix locatif.
	 * @param prix Le prix à convertir
	 * @returns Le prix HT convertit en prix locatif
	 */
	public getPrixLocatif(prix: number): number {
		return (prix * (1 + (0.01 * (+this.tauxLocation[0]?.taux)))) / (+this.tauxLocation[0]?.mois);
	}

	/**
	 * Ajoute une configuration au panier.
	 * @param configuration La configuration à ajouter au panier
	 */
	public addToCart(configuration: Configuration): void {
		configuration.getProductListWithQuantities().forEach(produit => {
			const p = new Produit();
			p.reference = produit.produit;
			p.marque = this.marque;
			this.cartService.addProduit(p, produit.qte);
		});
		this.router.navigateByUrl('/panier');
	}

	/**
	 * Indique le type de l'option :
	 * - equipement, pour des listes de produits dans une sliding liste
	 * - input, pour un champ libre
	 * - one, pour des choix uniques
	 * @param option Une option
	 * @returns string
	 */
	typeDeProduit(option: any): string {
		if (option) {
			if (option.categorie === 'Équipement additionnel') return 'equipement';
			if (option.categorie === 'Service') return 'service';
			if (this.modeles.find(modele => modele.produit === this.configuration.modele).crits[option.options?.[0]?.['Cible']?.value]?.value.includes('à')) return 'input';
			return 'one';
		}
		return '';
	}

}

export class Modele {
	crits: { [key: string]: { value: string, type: string } };
	niv: { code: string; label: string }[];
	marque: { code: string, label: string };
	produit: string;
	reference: string;
	photo: string;
	description: string;
	pdfs: Array<{ label: string, url: string }>;
	details: string[];
	equipements: BehaviorSubject<Produit[]>;
	services: BehaviorSubject<Produit[]>;
}

export type Option = { [key: string]: { value: string; type: string; sequence: string } };

export type AssociativeArray = { [key: string]: string };
