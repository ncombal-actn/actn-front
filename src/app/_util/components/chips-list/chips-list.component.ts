import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {WindowService} from '@core/_services';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-chips-list',
  templateUrl: './chips-list.component.html',
  styleUrls: ['./chips-list.component.scss']
})
export class ChipsListComponent implements OnInit, OnDestroy, AfterViewInit {

  /** Output de la liste de valeurs des chips selectionnés dans le ChipsListComponent
   * Emet à chaque clic sur un chips */
  @Output() selectedValues = new EventEmitter<string[]>();

  /** Titre affiché de la liste */
  @Input() title = '';
  lastValue = -1;
  repli = true;
  x
  protected readonly faChevronUp = faChevronUp;
  protected readonly faChevronDown = faChevronDown;
  @ViewChild('container') private _container: ElementRef<HTMLElement>;
  private _values = new BehaviorSubject<Chips[]>([]);
  /** Observable de nettoyage, déclanchée à la destruction du composant */
  private _destroy$ = new Subject<void>();
  /** Nombre de lignes maximum pour l'affichage des Chips */
  private _maxLines = 1;

  constructor(
    private window: WindowService
  ) {
  }

  /** Liste des Chips à afficher */
  @Input()
  set chips(values: Chips[]) {
    this._values.next(values);
    setTimeout(() => {
      const elements = Array.from(this._container?.nativeElement.children ?? []);
      if(this.window.isBrowser()){
        this.lastValue = elements.findIndex(element => this.window.getBoundingClientRect(element).top > this.window.getBoundingClientRect(this._container.nativeElement).top + 40 * this._maxLines);
        //this.lastValue = x === -1 ? 1000 : x - 1;
      }
    });
  }

  /** Observable de la liste des Chips à afficher */
  get values$(): Observable<Chips[]> {
    return this._values.asObservable();
  }

  /** Tableau de 'value' des Chips selectionnés */
  private _selected = new Array<string>();

  /** Values des chips selectionnés à la création */
  get selected(): Array<string> {
    return this._selected;
  }

  /** Values des chips selectionnés à la création */
  @Input() set selected(values: Array<string>) {
    this._selected = values;
  }

  /** Initialisation de ChipsListComponent */
  ngOnInit(): void {
    // console.log("get chipped");
    /*fromEvent(this.window.window, 'resize')
      .pipe(takeUntil(this._destroy$), debounceTime(20))
      .subscribe(() => {
        this.init();
      });*/
  }

  /** Destruction de ChipsListComponent */
  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** Une fois que la vue a finit de charger*/
  ngAfterViewInit(): void {
    //this.init();

  }

  init(): void {
    const elements = Array.from(this._container?.nativeElement.children ?? []);
    this.x = elements.findIndex(element => this.window.getBoundingClientRect(element).top > this.window.getBoundingClientRect(this._container.nativeElement).top + 40 * this._maxLines);
    setTimeout(() => {
      this.lastValue = this.x === -1 ? 1000 : this.x - 1;
      this.onClickMoins();
    });
  }

  onClickPlus(): void {
    const elements = Array.from(this._container?.nativeElement.children);
    if (this._container) {
      const offset = this.window.getBoundingClientRect(this._container.nativeElement).right - this.window.getBoundingClientRect(elements[elements.length - 1]).right < 60 ? 40 : 0;
      this._container.nativeElement.style.maxHeight = `${this.window.getBoundingClientRect(elements[elements.length - 1]).top - this.window.getBoundingClientRect(this._container.nativeElement).top + 40 + offset}px`;
    }
    this.repli = false;
  }

  onClickMoins(): void {
    if (this._container) {
      this._container.nativeElement.style.maxHeight = `${this._maxLines * 40}px`;
    }
    this.repli = true;
  }

  /** Vérifie que le chips est selectionnable
   * Retire la valeur du chips de la liste 'this._selected' s'il est déjà selectionné
   * le rajoute à la liste dans le cas contraire
   * puis Emet l'Observable 'this.selectedValues' avec toutes les valeurs selectionnées */
  onClickChips(chips: Chips): void {


    if (chips.count !== 0 || (chips.count === 0 && this._selected.includes(chips.value))) {
      const elem = this._selected.findIndex(e => e === chips.value);
      if (elem === -1) {
        this._selected.push(chips.value);
      } else {
        this._selected.splice(elem, 1);
      }
      this.selectedValues.emit(this._selected);

    }
  }
}

/**
 * Informations d'un "chips"
 * Utilisé dans ChipsListComponent
 */
export class Chips {
  /** Code de valeur du Chips */
  value: string;
  /** Libellé affiché dans le Chips */
  libelle: string;
  /** Le nombre de valeurs dans  Chips */
  count: number;
  /** Texte affiché lorsque l'on survole le Chips */
  tooltip: string;
}
