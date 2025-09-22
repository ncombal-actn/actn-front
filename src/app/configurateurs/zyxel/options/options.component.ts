import { Produit, User } from '@/_util/models';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, ComponentsInteractionService, SvgService } from '@core/_services';
import { ProduitService } from '@core/_services/produit.service';
import { environment } from '@env';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, skip, take, takeUntil } from 'rxjs/operators';
import { Configuration } from '../../configuration.model';
import { ConfigurateurService, Modele } from '../../configurateur.service';
import {faFilePdf, faPlayCircle, faTimes, faTimesCircle} from "@fortawesome/free-solid-svg-icons";

@Component({
	selector: 'app-options',
	templateUrl: './options.component.html',
	styleUrls: ['./options.component.scss', '../modeles/modeles.component.scss'],
	animations: [
		trigger('expandVertical', [
			state(
				'open',
				style({
					height: '*'
				})
			),
			state(
				'closed',
				style({
					height: '2em'
				})
			),
			transition('open => closed', animate('300ms ease-in-out')),
			transition('closed => open', animate('300ms ease-in-out'))
		]),
		trigger('expandVerticalTo0', [
			state(
				'open',
				style({
					height: '*'
				})
			),
			state(
				'closed',
				style({
					height: '0'
				})
			),
			transition('open => closed', animate('300ms ease-in-out')),
			transition('closed => open', animate('300ms ease-in-out'))
		])
	]
})
export class OptionsComponent implements OnInit, OnDestroy {

	environment = environment;
	gamme = { titre: '', texte: '' };
	couleurGamme = 1;
	modele: Modele;
	options$ = new BehaviorSubject<any>([]);

	blocsOpened = new Array<boolean>(4);
	optionsOpened: Array<boolean[]>;
	categorieAffichage = 0;
	isReady = false;
	isSwitchRight = false;
	showHelpPopup = false;
	showSpecPopup = false;
	showPrixLocatif = false;
	recapOpen = false;

	helpForm: FormGroup;
	configurateurForm: FormGroup;
	user: User = null;
	dernierBoitier = '';

	groups = ['Boitier', 'Licences', 'Services', 'Équipement additionnel'];

	stringFromDetails(details: string[]): string {
		return this.produitService.fullString(details);
	}

	protected skip = false;
	protected _destroy$ = new Subject<void>();
	protected _ID = 'Options';

	@ViewChildren('bloc') blocs: QueryList<ElementRef<HTMLElement>>;

	constructor(
		public configService: ConfigurateurService,
		protected router: Router,
		protected route: ActivatedRoute,
		protected fb: FormBuilder,
		protected authService: AuthenticationService,
		public componentsInteractionService: ComponentsInteractionService,
		protected produitService: ProduitService,
		public svg: SvgService
	) {
		this.optionsOpened = [new Array(10).fill(false), new Array(10).fill(false), new Array(10).fill(false), new Array(10).fill(false)];
	}

	ngOnInit(): void {
		this.configService.loading$
			.pipe(takeUntil(this._destroy$), filter(isLoading => !isLoading))
			.subscribe(() => {
				this.route.paramMap.pipe(take(1)).subscribe(route => {
					const nomGamme = route.get('gamme');
					const ref = route.get('modele');
					this.gamme = { titre: nomGamme, texte: this.configService.textes.get(nomGamme).get(nomGamme) };
					this.modele = this.configService.modeles.filter(modele => nomGamme.startsWith(modele.crits['Gamme'].value)).find(modele => modele.produit === ref);
					this.chargementOptions();
					this.configService.reload$.pipe(takeUntil(this._destroy$)).subscribe(() => this.chargementOptions());
				});
			});
		this.authService.currentUser$.pipe(takeUntil(this._destroy$)).subscribe(user => this.user = user);
	}

	ngOnDestroy(): void {
		this._destroy$.next();
		this._destroy$.complete();
	}

	/**
	 * Charge les différentes options relatives au modèle.
	 */
	chargementOptions(): void {
		// Charge les différentes options relatives au boitier et aux licences associées
		const optB = this.configService.options.filter(option => this.gamme.titre.startsWith(option['Gamme'].value) && option['NIV2'].value === 'FIR');
		const optL = this.configService.options.filter(option => this.gamme.titre.startsWith(option['Gamme'].value) && option['NIV2'].value !== 'FIR');
		// Récupère le nom des différentes catégories d'options
		const groupB = [...optB.reduce((acc, val) => acc.add(val['Type de matèriel'].value.split('#')[1] ?? val['Type de matèriel'].value), new Set<string>())];
		const groupL = [...optL.reduce((acc, val) => acc.add(val['Type de matèriel'].value.split('#')[1] ?? val['Type de matèriel'].value), new Set<string>())];
		// Hiérarchise ces options par catégorie
		// stringify -> parse pour dupliquer en mémoire l'objet
		let optionsBoitier = [];
		let optionsLicences = [];
		let optionsServices = [];
		let optionsEquipement = [];
		groupB.forEach(group => optionsBoitier.push({
			categorie: 'Boitier',
			name: group,
			options: JSON.parse(JSON.stringify(optB.filter(option => (option['Type de matèriel'].value.split('#')[1] ?? option['Type de matèriel'].value) === group && (option['liste'].value.split(',').some(modele => modele.trim() === this.modele.produit) || option['liste'].value === 'TOUS' || option['liste'].value.length === 0) && Object.entries(option).find(k => k[0].startsWith('Ligne'))[1].value === this.modele.produit))),
			description: '',
			sequence: 0
		}));
		groupL.forEach(group => {
			const options = optL.filter(option => (option['Type de matèriel'].value.split('#')[1] ?? option['Type de matèriel'].value) === group && (option['liste'].value.split(',').some(modele => modele.trim() === this.modele.produit) || option['liste'].value === 'TOUS' || option['liste'].value.length === 0));
			optionsLicences.push({
				categorie: 'Licences',
				name: group,
				options: JSON.parse(JSON.stringify(options.sort((a, b) => +a.prix.value - +b.prix.value))),
				description: '',
				type: this.modele.crits[options?.[0]?.['Cible']?.value]?.value.includes('à') ? 'input' : 'one',
				sequence: 0
			});
		});
		// Filtre les options
		optionsBoitier = optionsBoitier.filter(cat => cat.options.length > 0);
		optionsLicences = optionsLicences.filter(cat => cat.options.length > 0);
		// Réécrit le produit
		optionsBoitier.forEach(cat => cat.options.forEach(p => p.produit.value = this.configService.produits.find(produit => produit.reference === p.produit.value)));
		optionsLicences.forEach(cat => cat.options.forEach(p => p.produit.value = this.configService.produits.find(produit => produit.reference === p.produit.value)));
		// Ajoute la description des catégories
		optionsBoitier.forEach(cat => cat.description = this.configService.textes.get(this.gamme.titre).get(cat.name));
		optionsLicences.forEach(cat => cat.description = this.configService.textes.get(this.gamme.titre).get(cat.name));
		// Ajoute l'ordre d'affichage des catégories
		optionsBoitier.forEach(cat => cat.sequence = cat.options[0]['Type de matèriel'].value.split('#')[0]);
		optionsLicences.forEach(cat => cat.sequence = cat.options[0]['Type de matèriel'].value.split('#')[0]);
		// Trie les catégories
		optionsBoitier.sort((a, b) => a.sequence - b.sequence);
		optionsLicences.sort((a, b) => a.sequence - b.sequence);
		this.options$.next([optionsBoitier, optionsLicences, optionsServices, optionsEquipement]);
		this.options$.asObservable().pipe(skip(2), take(1)).subscribe(() => {
			this.initConfiguration();
			this.buildFormulaire();
		});
		this.chargementEquipementAdditionnel();
		this.chargementServices();
	}

	chargementEquipementAdditionnel(): void {
		const optionsEquipement = [];
		const mappedProduits = this.modele.equipements.value.reduce((acc, produit) => {
			const lib = produit['niveaulibelle3'] || produit['niveaulibelle4'];
			const p = acc.get(lib);
			if (p) {
				acc.set(lib, [...p, produit]);
			} else {
				acc.set(lib, [produit]);
			}
			this.produitService.getProduitDescriptionById(produit.reference)
				.pipe(take(1))
				.subscribe(description => produit['details'] = description.filter(desc => desc.type === 'SPE').map(desc => desc.description));
			return acc;
		}, new Map<string, Produit[]>());
		for (const [key, value] of mappedProduits) {
			optionsEquipement.push({
				categorie: 'Équipement additionnel',
				name: key,
				options: value,
				description: '',
				sequence: 0
			});
		}
		this.options$.next([...this.options$.value.slice(0, 3), optionsEquipement]);
	}

	chargementServices(): void {
		const optionsServices = [];
		const mappedProduits = this.modele.services.value.reduce((acc, produit) => {
			const lib = produit['niveaulibelle2'];
			const p = acc.get(lib);
			if (p) {
				acc.set(lib, [...p, produit]);
			} else {
				acc.set(lib, [produit]);
			}
			this.produitService.getProduitDescriptionById(produit.reference)
				.pipe(take(1))
				.subscribe(description => produit['details'] = description.filter(desc => desc.type === 'SPE').map(desc => desc.description));
			return acc;
		}, new Map<string, Produit[]>());
		for (const [key, value] of mappedProduits) {
			optionsServices.push({
				categorie: 'Service',
				name: key,
				options: value,
				description: '',
				sequence: 0
			});
		}
		const options = [this.options$.value[0], this.options$.value[1], optionsServices, this.options$.value[3]];
		this.options$.next(options);
	}

	/**
	 * Initialise la configuration si le modèle est différent ou si on essaye de charger une configuration sauvegardée.
	 */
	initConfiguration(): void {
		if (this.configService.configuration?.modele !== this.modele.produit || this.configService.pendingProducts.length > 0) {
			this.configService.configuration = new Configuration(this.configService, this.produitService);
			this.configService.configuration.modele = this.modele.produit;
			this.groups.forEach((group, i) => {
				this.configService.configuration.addGroup(group);
				this.options$.value[i].forEach(type => this.configService.configuration.addCategory(group, type.name));
			});
			this.configService.configuration.name = this.configService?.pendingName ?? '';
			this.configService.configuration.commentaires = this.configService?.pendingCommentaires ?? '';
		}
	}

	/**
	 * Initialise le formulaire de configuration.
	 */
	buildFormulaire(): void {
		// Construit le formulaire selon les options disponibles
		this.configurateurForm = this.fb.group({});
		this.groups.forEach((group, index) => {
			const fg = new FormGroup({});
			if (group === 'Services') {
				this.options$.value[index].forEach(type => type.options.forEach(option => fg.addControl(option.reference, new FormControl(''))));
			} else {
				this.options$.value[index].forEach(type => fg.addControl(type.name, new FormControl('')));
			}
			this.configurateurForm.addControl(group, fg);
		});
		// Remplit le formulaire avec les données d'une configuration qui a déjà été créée
		Object.entries(this.configurateurForm.value).forEach(group => {
			// Traitement spécial des équipements additionnels
			if (group[0] === 'Équipement additionnel') {
				Object.entries(group[1]).forEach(category => {
					const o = this.configService.configuration.getOptions(group[0], category[0])[0];
					if (o?.option) {
						const produit = new Produit();
						produit.reference = o.option?.['produit'].value ?? '';
						produit.prix = +(o.option?.['prix'].value) || 0;
						produit['niveaulibelle3'] = category[0];
						this.equipementValueChange({ qte: o?.quantite, produit });
					}
				});
			} else if (group[0] === 'Services') {
				const options = this.configService.configuration.getOptions(group[0], 'PRESTATIONS');
				if (options) {
					Object.entries(group[1]).forEach(category => {
						const option = options.find(o => o.option.produit.value === category[0]);
						if (option) {
							this.configurateurForm.get(group[0]).get(category[0]).setValue(option.quantite > 0);
						}
					});
				}
			} else {
				Object.entries(group[1]).forEach(category => {
					if (group[0] === 'Boitier') {
						this.dernierBoitier = category[0];
					}
					this.configurateurForm.get(group[0]).get(category[0]).setValue(this.configService.configuration.getOptions(group[0], category[0])?.[0]?.option?.['produit'].value ?? '');
				});
			}
		});
		// Modifie la configuration à chaque changement de valeurs du formulaire
		this.configurateurForm.valueChanges
			.pipe(takeUntil(this._destroy$), filter(() => !this.skip))
			.subscribe(e => {
				Object.entries(e).forEach(group => {
					if (group[0] === 'Services') {
						Object.entries(group[1]).forEach(service => {
							const opt = Object.keys(this.configService.options[0]).reduce((acc, key) => acc = { ...acc, [key]: { value: '', type: '', sequence: '0' } }, {});
							const produit = this.modele.services.value.find(s => s.reference === service[0]);
							opt['description'] = { value: produit.designation, type: '0', sequence: '0' };
							opt['produit'] = { value: produit.reference, type: '0', sequence: '0' };
							opt['prix'] = { value: produit.prix.toString(), type: '0', sequence: '0' };
							this.configService.configuration.addOption(this.groups[2], produit['niveaulibelle2'], { option: opt, quantite: service[1] ? 1 : 0 });
						});
					} else if (group[0] !== 'Équipement additionnel') {
						Object.entries(group[1]).forEach(categorie => {
							const v = [];
							// Ne concerne que les options à choix uniques, les autres sont traitées différemments
							if (this.configService.typeDeProduit({ options: this.configService.configuration.getOptions(group[0], categorie[0]).map(option => option.option) }) === 'one') {
								v.push({ option: this.configService.options.find(option => option['produit'].value === categorie[1]), quantite: 1 });
								this.configService.configuration.setOptions(group[0], categorie[0], v);
							}
						});
					}
				});
				this.verifUnSeulBoitier(e);
				this.configService.configurationChange.next(this._ID);
			});
		this.rechargeFormulaire();
		// Remplit le formulaire avec les données d'une configuration sauvegardée
		setTimeout(() => {
			if (this.configService.pendingProducts.length > 0) {
				this.configService.pendingProducts.forEach(pp => {
					const group = pp.option['group'].value;
					const category = pp.option['Type de matèriel'].value.split('#')[1];
					switch (this.configService.typeDeProduit({ options: [pp.option], categorie: group })) {
						case 'one':
							this.configurateurForm.get(group).get(category).setValue(pp.option['produit'].value);
							break;
						case 'input':
							{
								const options = this.configService.configuration.getOptions(group, category);
								options.find(option => option.option['produit'].value === pp.option['produit'].value).quantite = pp.quantite;
								this.configService.configuration.setOptions(group, category, options);
							}
							break;
						case 'equipement':
							{
								const p = this.configService.produits.find(produit => produit.reference === pp.option['produit'].value);
								this.equipementValueChange({ qte: pp?.quantite, produit: p });
							}
							break;
						case 'service':
							this.configurateurForm.get('Services').get(pp.option['produit'].value).setValue(pp.quantite > 0);
							break;
					}
				});
				this.configService.pendingProducts = [];
				this.router.navigate(['..', 'recapitulatif'], { relativeTo: this.route });
			}
		});
		this.isReady = true;
	}

	/**
	 * Recharge le formulaire quand un élément externe le modifie.
	 */
	rechargeFormulaire(): void {
		this.configService.configurationChange.pipe(takeUntil(this._destroy$), filter(v => v !== this._ID)).subscribe(() => {
			this.skip = true;
			this.configService.configuration.configuration.forEach((group, g) => {
				if (g === 'Services') {
					group.forEach((categorie, c) => {
						categorie.forEach(service => {
							this.configurateurForm.get(g).get(service.option.produit.value).setValue(service.quantite > 0);
						})
					});
				} else if (g !== 'Équipement additionnel') {
					group.forEach((categorie, c) => {
						this.configurateurForm.get(g).get(c).setValue(categorie[0]?.option?.produit.value ?? '');
					});
				}
			});
			this.skip = false;
		});
	}

	/**
	 * Ne conserve qu'un seul boitier, déselectionne le premier boitier choisi lorsqu'un autre boitier est sélectionné.
	 * @param e Le formulaire de la configuration
	 */
	verifUnSeulBoitier(e: any): void {
		// setTimeout(() => {
		// 	const boitiers = Object.entries(Object.values(e)[0]).filter(([key, _]) => [...this.options$.value[0]].map(option => option.name).includes(key));
		// 	const count = boitiers.reduce((acc, val) => acc += val[1] === '' ? 0 : 1, 0);
		// 	if (count === 1) {
		// 		this.dernierBoitier = boitiers.find(b => b[1] !== '')?.[0] ?? '' as string;
		// 	} else if (count > 1) {
		// 		this.configurateurForm.get(this.groups[0]).get(this.dernierBoitier).setValue('');
		// 		boitiers.find(b => b[0] === this.dernierBoitier)[1] = '';
		// 		this.dernierBoitier = boitiers.find(b => b[1] !== '')?.[0] ?? '' as string;
		// 	}
		// })
	}

	onHideSpecPopup(): void {
		this.showSpecPopup = false;
	}

	/**
	 * Déselectionne une option.
	 * @param optionName Le nom de l'option à modifier
	 */
	onClickOption(group: string, optionName: string): void {
		this.configurateurForm.get(group).get(optionName).setValue('');
		this.configService.configurationChange.next(this._ID);
	}

	/**
	 * Retourne le critère de sélection correspondant à une référence.
	 * @param reference La référence choisie
	 * @returns Le critère correspondant à la référence
	 */
	optionFromReference(reference: string): string {
		const value = this.configService.options.find(option => option['produit'].value === reference);
		const ret = value?.[value['Cible'].value].value ?? '';
		return ret === '' ? reference : ret + ' ' + value['Unité'].value;
	}

	/**
	 * Déplace la vue de l'utilisateur au niveau des boitiers et ouvre toutes les options de boitier.
	 */
	onClickConfigurez(): void {
		window.scrollTo({ behavior: 'smooth', top: this.blocs.get(0).nativeElement.getBoundingClientRect().top + window.scrollY - 120 });
		this.optionsOpened[0] = this.optionsOpened[0].map(() => true);
	}

	equipementValueChange(value: { qte: number, produit: Produit }): void {
		const opt = Object.keys(this.configService.options[0]).reduce((acc, key) => acc = { ...acc, [key]: { value: '', type: '', sequence: '0' } }, {});
		opt['produit'] = { value: value.produit.reference, type: '0', sequence: '0' };
		opt['prix'] = { value: value.produit.prix.toString(), type: '0', sequence: '0' };
		this.configService.configuration.addOption(this.groups[3], value.produit['niveaulibelle3'] || value.produit['niveaulibelle4'], { option: opt, quantite: value.qte });
	}

  protected readonly faFilePdf = faFilePdf;
  protected readonly faPlayCircle = faPlayCircle;
  protected readonly faTimes = faTimes;
  protected readonly faTimesCircle = faTimesCircle;
}
