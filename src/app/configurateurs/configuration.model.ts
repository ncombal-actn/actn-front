import { ProduitService } from '@core/_services/produit.service';
import { filter } from 'rxjs/operators';
import { ConfigurateurService, Option } from './configurateur.service';

/**
 * Classe de gestion d'une configuration.
 */
export class Configuration {

	/**
	 * Renvoie les données de la configuration, non modifiable.
	 */
	public get configuration(): ReadonlyMap<string, ReadonlyMap<string, { option: Option, quantite: number }[]>> {
		return this._data;
	}
	/**
	 * Remplace complètement les données.
	 * @param value Une configuration déjà faite
	 */
	public fromMap(value: Map<string, Map<string, { option: Option, quantite: number }[]>>): void {
		this._data = value;
	}

	/**
	 * La somme de tous les prix **revendeurs** des produits de la configuration.
	 */
	public get prix(): number {
		let p = 0;
		this._data.forEach(group => {
			group.forEach(category => {
				category.forEach(option => {
					p += (this.configService.produits.find(produit => produit.reference === option.option?.produit.value)?.prix ?? 0) * option.quantite;
				});
			});
		});
		return p;
	}

	/**
	 * La somme de tous les prix **publics** des produits de la configuration.
	 */
	public get prixPublic(): number {
		let p = 0;
		this._data.forEach(group => {
			group.forEach(category => {
				category.forEach(option => {
          p += (this.configService.produits.find(produit => produit.reference === option.option?.produit.value)?.prixPublic ?? 0) * option.quantite;
        });
			});
		});
		return p;
	}

	public get date(): Date { return this._date; }

	public get id(): string { return this._id; }

	public get modele(): string { return this._modele; }
	public set modele(value: string) { this._modele = value; }

	public get name(): string { return this._name; }
	public set name(value: string) { this._name = value; }

	public get commentaires(): string { return this._commentaires; }
	public set commentaires(value: string) { this._commentaires = value; }

	private _date = new Date();
	private _id = '';
	private _modele = '';
	private _name = '';
	private _commentaires = '';
	private _data: Map<string, Map<string, { option: Option, quantite: number }[]>>;

	constructor(
		private configService: ConfigurateurService,
		private produitService: ProduitService
	) {
		this._data = new Map();
		const pool = "0123456789";
		for (let i = 0; i < 8; i++) {
			this._id += pool[Math.floor(Math.random() * 10)];
		}
	}

	/**
	 * Ajoute un groupe à la configuration.
	 *
	 * @param group Le nom du groupe
	 */
	public addGroup(group: string): void {
		this._data.set(group, new Map());
	}

	/**
	 * Retourne la liste des groupes ajoutés à la configuration.
	 *
	 * @returns Un tableau de string
	 */
	public getGroups(): string[] {
		return Object.keys(this._data.keys());
	}

	/**
	 * Ajoute une catégorie à un groupe de la configuration.
	 *
	 * @param group Le nom du groupe
	 * @param category Le nom de la catégorie
	 */
	public addCategory(group: string, category: string): void {
		this._data.get(group).set(category, []);
	}

	/**
	 * Retourne la liste des catégories ajoutées à un groupe.
	 *
	 * @param group Le nom d'un groupe
	 * @returns une liste de string
	 */
	public getCategoriesOfGroup(group: string): string[] {
		return Object.keys(this._data.get(group).keys());
	}

	/**
	 * Ajoute une option à une catégorie, la remplace si existante.
	 *
	 * @param group Le nom du groupe
	 * @param category Le nom de la catégorie
	 * @param option L'option à rajouter
	 */
	public addOption(
		group: string,
		category: string,
		option: { option: Option, quantite: number }
	): void {
		const values = this._data.get(group).get(category);
		const i = values.findIndex(o => o.option?.produit.value === option.option.produit.value);
		if (i !== -1) {
			values[i] = option;
		} else {
			values.push(option);
		}
		this.setOptions(group, category, values);
	}

	/**
	 * Remplace une option par une autre.
	 *
	 * @param group Le nom du groupe
	 * @param category Le nom de la catégorie
	 * @param oldOption L'option à remplacer
	 * @param newOption La nouvelle option
	 */
	public replaceOption(
		group: string,
		category: string,
		oldOption: { option: Option, quantite: number },
		newOption: { option: Option, quantite: number }
	): void {
		const values = this._data.get(group).get(category);
		const i = values.findIndex(o => o.option.produit.value === oldOption.option.produit.value);
		if (i !== -1) {
			values[i] = newOption;
		}
		this.setOptions(group, category, values);
	}

	/**
	 * Supprime les options d'une catégorie.
	 *
	 * @param group Le nom du groupe
	 * @param category Le nom de la catégorie
	 */
	public removeOptions(
		group: string,
		category: string
	): void {
		this._data.get(group).set(category, []);
	}

	/**
	 * Affecte tout un groupe d'options à une catégorie.
	 *
	 * @param group Le nom du groupe
	 * @param category Le nom de la catégorie
	 * @param options Le tableau d'options à affecter
	 */
	public setOptions(
		group: string,
		category: string,
		options: { option: Option, quantite: number }[]
	): void {
		options = options.filter(option => !!option.option);
		this._data.get(group).set(category, options);
	}

	/**
	 * Retourne tout un groupe d'options.
	 *
	 * @param group Le nom du groupe
	 * @param category Le nom de la catégorie
	 */
	public getOptions(
		group: string,
		category: string,
	): { option: Option, quantite: number }[] {
		return this._data.get(group).get(category);
	}

	/**
	 * Retourne le nombre totale d'une option composée.
	 * @param group Le nom du groupe
	 * @param category Le nom de la catégorie
	 * @returns number
	 */
	public nbOfOptionGrouped(
		group: string,
		category: string,
	): number {
		return this.configService.configuration.getOptions(group, category).reduce((acc, val) => acc += val.quantite * +val.option[val.option['Cible'].value].value, 0);
	}

	/**
	 * Retourne le prix totale d'une option composée.
	 * @param group Le nom du groupe
	 * @param category Le nom de la catégorie
	 * @returns number
	 */
	public priceOfOptionGrouped(
		group: string,
		category: string,
	): number {
		return this.configService.configuration.getOptions(group, category).reduce((acc, val) => acc += val.quantite * +val.option['prix'].value, 0);
	}

	/**
	 * Indique le nombre de catégorie qui ont au moins une option.
	 *
	 * @param group
	 * @returns
	 */
	public getNbCategoryChoices(group: string): number {
		let nb = 0;
		this._data.get(group).forEach(category => {
			nb += category.reduce((acc, val) => acc += val?.option ? val.quantite : 0, 0);
		});
		return nb;
	}

	/**
	 * Renvoie la liste des références de toutes les options sélectionnées.
	 *
	 * @returns string[]
	 */
	public getProductList(): string[] {
		const ret = [];
		this._data.forEach(group => {
			group.forEach(category => {
				category.forEach(option => {
					if (option?.option?.produit.value) {
						ret.push(option?.option?.produit.value);
					}
				});
			});
		});
		return ret;
	}

	/**
	 * Renvoie la liste des références de toutes les options sélectionnées et les quantités associées.
	 *
	 * @returns \{ produit: string, qte: number }[]
	 */
	public getProductListWithQuantities(): { produit: string, qte: number }[] {
		const ret = [];
		this._data.forEach(group => {
			group.forEach(category => {
				category.forEach(option => {
					if (option?.option?.produit.value) {
						ret.push({ produit: option.option.produit.value, qte: option.quantite });
					}
				});
			});
		});
		return ret;
	}

	/**
	 * Stringify la configuration.
	 *
	 * @returns La configuration sous forme de string
	 */
	public toSave(): any[] {
		const saved = [];
		this._data.forEach(group => {
			group.forEach(options => {
				if (options) {
					options.forEach(option => {
						if (option.quantite > 0) {
							saved.push({ reference: option.option['produit'].value, quantite: option.quantite });
						}
					});
				}
			});
		});
		return [this.configService.marque, this.modele, this._id, this._date.getTime(), this._name, this._commentaires, saved];
	}

	/**
	 * Parse une string afin de regénérer une configuration.
	 *
	 * @param str Une configuration stringified
	 */
	public parse(s: any): void {
		this.configService.loading$
			.pipe(filter(isLoading => !isLoading))
			.subscribe(() => {
				this._modele = s[1];
				this._id = s[2];
				this._date = new Date(s[3]);
				this._name = s[4];
				this._commentaires = s[5];
				const ret = new Map<string, Map<string, { option: Option, quantite: number }[]>>();
				this.configService.categories.forEach(category => this.addGroup(category.value));
				s[6].forEach(produit => {
					let option = this.configService.options.find(option => option['produit'].value === produit.reference);
					let group = '';
					let category = '';
					if (option) {
						group = option['group'].value;
						category = option['Type de matèriel'].value.split('#')[1];
						const m = ret.get(group) ?? new Map<string, { option: Option, quantite: number }[]>();
						const arr = m.get(category) ?? [];
						arr.push({ option: option, quantite: +produit.quantite });
						m.set(category, arr);
						ret.set(group, m);
					} else {
						const p = this.configService.modeles.find(modele => modele.produit === this._modele).equipements.value.find(equipement => equipement.reference === produit.reference);
						group = 'Équipement additionnel';
						category = p['niveaulibelle3'] || p['niveaulibelle4'];
						const m = ret.get(group) ?? new Map<string, { option: Option, quantite: number }[]>();
						const arr = m.get(category) ?? [];
						option = {};
						option['Type de matèriel'] = { value: category, type: '', sequence: '0' };
						option['NIV1'] = { value: p['niveaucode1'], type: '', sequence: '0' };
						option['NIV2'] = { value: p['niveaucode2'], type: '', sequence: '0' };
						option['NIV3'] = { value: p['niveaucode3'], type: '', sequence: '0' };
						option['NIV4'] = { value: p['niveaucode4'], type: '', sequence: '0' };
						option['NIV5'] = { value: p['niveaucode5'], type: '', sequence: '0' };
						option['marque'] = { value: p.marque, type: '', sequence: '0' };
						option['marquelibelle'] = { value: p.marquelib, type: '', sequence: '0' };
						option['produit'] = { value: p.reference, type: '', sequence: '0' };
						option['group'] = { value: group, type: '', sequence: '0' };
						arr.push({ option: option, quantite: +produit.quantite });
						m.set(category, arr);
						ret.set(group, m);
					}
				})
				this._data = ret;
			});
	}
}
