import { Component, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { LoadingService } from '@core/_services/loading.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-spinner',
	templateUrl: './spinner.component.html',
	styleUrls: ['./spinner.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements AfterViewInit, OnDestroy {

	loadingSubscription: Subscription;
	state = true;

	constructor(public loadingService: LoadingService) { }

	ngAfterViewInit(): void {
		this.loadingSubscription = this.loadingService.isLoading$.pipe().subscribe((isLoading: boolean) => {
			this.state = isLoading;
		});
	}

	ngOnDestroy(): void {
		this.loadingSubscription.unsubscribe();
	}
}

/**
 * Type pour manipuler la barre de progression du chargement.
 */
export type ProgressBarState = {
	/** true pour afficher la barre de progression, false sinon */
	isShowing: boolean;

	/** Le pourcentage de progression de 0 à 100 */
	progression: number; 

	/** Une phrase de de description du status */
	texte: string;
}
