import { Injectable } from '@angular/core';
import { LocalStorageService } from '@core/_services';
import { ProduitService } from '@core/_services/produit.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ConfigurateurService } from '../configurateur.service';
import { Configuration } from '../configuration.model';

@Injectable({
	providedIn: 'root'
})
export class SauvegardeService {

	public get configurations(): Configuration[] { return this._configurations$.value; }
	public get configurations$(): Observable<Configuration[]> { return this._configurations$.asObservable(); }

	protected _ID = 'actnConfigurations';
	protected _reload$: Subscription = null;
	protected _load$: Subscription = null;
	protected _configurations$ = new BehaviorSubject<Configuration[]>([]);

	constructor(
		protected configurateurService: ConfigurateurService,
		protected localStorage: LocalStorageService,
		protected produitService: ProduitService
	) {
		this._load();
	}

	/**
	 * Ajoute une configuration dans le localStorage.
	 * @param configuration La configuration à sauvegarder
	 */
	public add(configuration: Configuration): void {
		this._configurations$.next([...this.configurations, configuration]);
		this._save();
	}

	/**
	 * Supprime une configuration de la liste des configurations sauvegardées.
	 * @param configuration La configuration à supprimer
	 */
	public delete(configuration: Configuration): void {
		this._configurations$.next(this.configurations.filter(c => c.id !== configuration.id));
		this._save();
	}

	/**
	 * Charge les configurations contenues dans le localStorage.
	 */
	protected _load(): void {
		this._load$?.unsubscribe();
		this._load$ = this.configurateurService.loading$
			.pipe(filter(isLoading => !isLoading))
			.subscribe(() => {
				const parse = () => {
					this._configurations$.next([]);
					if (arr) {
						Object.values(arr).forEach(c => {
							if (c[0] === this.configurateurService.marque) {
								const configuration = new Configuration(this.configurateurService, this.produitService);
								configuration.parse(c);
								this._configurations$.next(this.configurations.concat([configuration]));
							}
						});
					}
				};

				const arr = JSON.parse(this.localStorage.getItem(this._ID));
				parse();
				this._reload$?.unsubscribe();
				this._reload$ = this.configurateurService.reload$.subscribe(() => {
					parse();
				})
			});
	}

	/**
	 * Sauvegarde une configuration dans le localStorage.
	 */
	protected _save(): void {
		const toSave = this.configurations.map(configuration => configuration.toSave());
		this.localStorage.setItem(this._ID, JSON.stringify(toSave));
	}
}
