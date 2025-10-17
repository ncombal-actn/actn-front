import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import {
  faEuroSign,
  faExclamationTriangle, faFilePdf, faInfoCircle, faPaperPlane,
  faQuestionCircle, faRedoAlt,
  faShareAlt,
  faStar,
  faTimesCircle, faTrash
} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {MatTooltip} from "@angular/material/tooltip";
import {SvgIconComponent} from "angular-svg-icon";

/**
 * Composant permettant d'afficher une selections d'icones différentes
 * + du texte lorsque l'on survole l'icone avec sa souris
 * @param showDelay Delais avant l'apparition du texte lorsque l'on survole le composant avec sa souris
 * @param hideDelay Delais avant la disparition du texte lorsque l'on arrete de survoler le composant avec sa souris
 * @param text Texte à afficher lorsque l'on survole le composant avec sa souris
 * @param type Définit le type d'icone qui sera affiché et son CSS
 * @param position Position d'affichage du texte par rapport à l'icone
 */
@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [
    FaIconComponent,
    MatTooltip,
    SvgIconComponent
  ],
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TooltipComponent  {

  /** Delais avant l'apparition du texte lorsque l'on survole le composant avec sa souris */
  @Input() showDelay = 0;
  /** Delais avant la disparition du texte lorsque l'on arrete de survoler le composant avec sa souris */
  @Input() hideDelay = 0;
  /** Texte à afficher lorsque l'on survole le composant avec sa souris */
  @Input() text = 'placeholder';
  /** Définit le type d'icone qui sera affiché et son CSS */
  @Input() type: 'help' | 'alert' | 'error' | 'share' | 'favoris' | 'favoris-empty' | 'reload' | 'trash' | 'cart' | 'help-me' | 'assos'|'problem'|'edit' | 'pdf' | 'cotation' | 'cotationWarn' | 'location'  = 'help' ;
  /** Position d'affichage du texte par rapport à l'icone */
  @Input() position: 'left' | 'right' | 'above' | 'below' = 'above';

  /** Lien relatif à l'application d'un .svg */
  svgAssosPath = "assets/svg/icone_produit_associe.svg";
  /** Lien relatif à l'application d'un .svg */
  svgLocationPath = "assets/svg/ico-location-last.svg";


  protected readonly faQuestionCircle = faQuestionCircle;
  protected readonly faExclamationTriangle = faExclamationTriangle;
  protected readonly faTimesCircle = faTimesCircle;
  protected readonly faShareAlt = faShareAlt;
  protected readonly faStar = faStar;
  protected readonly faFilePdf = faFilePdf;
  protected readonly faRedoAlt = faRedoAlt;
  protected readonly faTrash = faTrash;
  protected readonly faPaperPlane = faPaperPlane;
  protected readonly faInfoCircle = faInfoCircle;
  protected readonly faEuroSign = faEuroSign;
}
