import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-labels-panier',
  standalone: true,
  templateUrl: './labels-panier.component.html',
  styleUrls: ['./labels-panier.component.scss']
})
export class LabelsPanierComponent implements OnInit
{

	// FORMAT PANIER : 				affichage == 0
	// FORMAT VALIDATION PANIER : 	affichage == 1
	@Input() modeAffichage:number = 0;

	constructor() { }

	ngOnInit(): void {
	}

}
