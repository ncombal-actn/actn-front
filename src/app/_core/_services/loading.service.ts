import { ProgressBarState } from '@/_util/components/spinner/spinner.component';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class LoadingService {

	get isLoading$(): Subject<boolean> {
		return this._isLoading$;
	}

	get progressBarState(): ProgressBarState { return this._progressBarState$.value; }
	set progressBarState(value: ProgressBarState) { this._progressBarState$.next(value); }

	get progressBarState$(): Observable<ProgressBarState> { return this._progressBarState$.asObservable(); }

	private _isLoading$: Subject<boolean> = new Subject();
	private _progressBarState$ = new BehaviorSubject<ProgressBarState>({
		isShowing: false,
		progression: 0,
		texte: ''
	});

	/**
	 * Démarre le chargement.
	 */
	public startLoading(): void {
		setTimeout(() => this._isLoading$.next(true));
	}

	/**
	 * Arrête le chargement.
	 */
	public stopLoading(): void {
		setTimeout(() => this._isLoading$.next(false));
	}

	constructor() { }
}
