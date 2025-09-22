import { Component, OnInit, Input } from '@angular/core';
import {faChevronDown, faFileLines} from "@fortawesome/free-solid-svg-icons";

/**
 * Composant utile
 * Affichant un titre, une annotation optionnelle puis une ligne
 */
@Component({
	selector: 'app-title-w-line',
	templateUrl: './title-w-line.component.html',
	styleUrls: ['./title-w-line.component.scss']
})
export class TitleWLineComponent implements OnInit {

	@Input() test: object;
	/** Titre affiché par le composant */
	@Input() title: string;
	/** Nom de la classe css de title-w-line.component.scss à rajouter à la ligne du titre */
	@Input() size: string;
	/** Texte à afficher en petit à coté du titre */
	@Input() annotation = "";
	/** Bool : Est-ce que l'on affiche la ligne après le titre ? */
	@Input() withLine = true;
	@Input() collapsible = false;
	@Input() doWrap :boolean ;
	@Input() icon: string ;

	@Input() collapsed = false;

	constructor() { }

	ngOnInit(): void { }

	/**
	 * Inverse l'état collapsed du titre.
	 */
	toggleCollapsed(): void {
		this.collapsed = !this.collapsed;
	}

  protected readonly faChevronDown = faChevronDown;
  protected readonly faFileLines = faFileLines;
  
}
