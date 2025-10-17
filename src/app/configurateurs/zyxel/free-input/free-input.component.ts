import { ConfigurateurService, Modele } from '@/configurateurs/configurateur.service';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {InputNumberComponent} from "@/configurateurs/zyxel/input-number/input-number.component";
import {CurrencyPipe} from "@angular/common";

@Component({
	selector: 'conf-free-input',
  standalone: true,
  imports: [
    InputNumberComponent,
    CurrencyPipe
  ],
	templateUrl: './free-input.component.html',
	styleUrls: ['./free-input.component.scss']
})
export class FreeInputComponent implements OnInit, OnDestroy {

	@Input() modele: Modele;
	@Input() options;
	@Input() group = 'Licences';
	@Input() showLibelles = true;
	@Input() lockMin = false;

	public maximum = Number.MAX_SAFE_INTEGER;

	@Output() value = new EventEmitter<number>();

	public n = 0;

	protected _destroy$ = new Subject<void>();

	constructor(
		public configService: ConfigurateurService
	) { }

	ngOnInit(): void {
		this.n = this.minOfInput() + this.configService.configuration.getOptions(this.options.categorie, this.options.name).reduce((acc, val) => acc += val.quantite * +val.option[val.option['Cible'].value].value, 0);
		this.configService.configurationChange.pipe(takeUntil(this._destroy$)).subscribe(() => {
			this.n = this.minOfInput() + this.configService.configuration.getOptions(this.options.categorie, this.options.name).reduce((acc, val) => acc += val.quantite * +val.option[val.option['Cible'].value].value, 0);
			this.inputValueChange(this.n);
		});
	}

	ngOnDestroy(): void {
		this._destroy$.next();
		this._destroy$.complete();
	}

	/**
	 * Retourne le minimum d'une option de type input.
	 * @returns number
	 */
	minOfInput(): number {
		return +(this.modele.crits[this.options.options[0]['Cible']?.value]?.value.split('à')[0]);
	}

	/**
	 * Retourne le maximum d'une option de type input.
	 * @returns number
	 */
	maxOfInput(): number {
		this.maximum = +(this.modele.crits[this.options.options[0]['Cible']?.value]?.value.split('à')[1]);
		return this.maximum;
	}

	/**
	 * Fais une composition de référence pour une option de type input.
	 * @param value La valeur actuelle du champ input
	 */
	inputValueChange(value: number): void {
		const min = this.minOfInput();
		const max = this.maxOfInput();
		this.n = value;
		if (value > max) value = max;
		if (this.lockMin && value <= min) value = min + 1;
		let inputs: { value: number; prix: number; produit: string }[] = this.options.options.map(option => { return { value: +option[option['Cible'].value].value, prix: +option.prix.value, produit: option.produit.value.reference ?? option.produit.value } });
		inputs = inputs.sort((a, b) => b.prix - a.prix);
		const choices: { [key: string]: number } = {};
		for (const input of inputs) choices[input.produit] = 0;
		let current = value - min;
		let steps = 100;
		while (current > 0 && steps > 0) {
			const solutions = [];
			for (let i = 0; i < inputs.length; i++) solutions.push(Math.abs(current - inputs[i].value));
			let best = { d: Number.MAX_SAFE_INTEGER, i: -1 };
			if (solutions.includes(0) || solutions.includes(1)) {
				best = solutions.reduce((acc, val, index) => {
					if (acc.d > val && val < 2) {
						acc.d = val;
						acc.i = index;
					}
					return acc;
				}, { d: Number.MAX_SAFE_INTEGER, i: -1 });
			} else {
				best = solutions.reduce((acc, val, index) => {
					if (acc.d >= val) {
						acc.d = val;
						acc.i = index;
					}
					return acc;
				}, { d: Number.MAX_SAFE_INTEGER, i: -1 });
			}
			current -= inputs[best.i].value;
			choices[inputs[best.i].produit]++;
			steps--;
		}
		const opt = Object.entries(choices).map(o => {
			return {
				option: this.configService.options.find(op => op['produit'].value === o[0]),
				quantite: o[1]
			};
		});
		this.value.emit(value);
		const o = this.configService.configuration.getOptions(this.options.categorie, this.options.name);
		if (opt.some((oo, i) => oo.quantite !== o[i]?.quantite)) {
			this.configService.configuration.setOptions(this.options.categorie, this.options.name, opt);
		}
	}

}
