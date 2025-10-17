import {Component, Input, OnInit, ViewChildren} from '@angular/core';
import {Produit} from '@/_util/models';
import {BehaviorSubject} from 'rxjs';
import {BanniereComponent} from '@/banniere/banniere.component';
import {WindowService} from '@core/_services';
import {InfiniteScrollService} from '@core/_services/infinite-scroll.service';
import {CommonModule} from "@angular/common";
import {InfiniteScrollDirective} from "ngx-infinite-scroll";
import {RouterLink} from "@angular/router";
import {ProduitPreviewComponent} from "@/_util/components/produit-preview/produit-preview.component";


/**
 * Affiche un ensemble de produits.
 */
@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [
    CommonModule,
    InfiniteScrollDirective,
    RouterLink,
    ProduitPreviewComponent,
    BanniereComponent
  ],
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.scss']
})
export class ProduitsComponent implements OnInit {

  @Input() produits: Produit[] | any[] ;
  produits$ = new BehaviorSubject<Produit[]>([]);
  //produits$ = new Observable<Produit[]>;
  /**
   * Format d'affichage (liste ou vignette)
   */
  @Input() format: string;

  @Input() listMarque: Array<string>;
  /**
   * Nombre de produits actuellement affichés
   */
  @Input() toDisplay = 15;
  // Est-ce que l'affichage des produits doit être simplifié ?
  @Input() simple = false;

  @ViewChildren(BanniereComponent) banniereCompList: Array<BanniereComponent>;

  // OPTIONNAL INPUT
  @Input() isFavorisList = false;
  isLoading = false;
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private window: WindowService, private infiniteScroll: InfiniteScrollService) {
  } //

  ngOnInit() {
    //this.produits$.next(this.produits);

    this.produits.sort((a, b) => Number(b.classe) - Number(a.classe));


    //this.loadData();
    /* this.produits$.pipe(
     map((produits) => produits.sort((a, b) => Number(b.classe) - Number(a.classe)))
     ); */
  }


  toggleLoading = () => {
    this.isLoading = !this.isLoading;
  }

  loadData = () => {
    this.toggleLoading();
    this.infiniteScroll.getItems(this.currentPage, this.itemsPerPage).subscribe({
      next: response => this.produits = response,
      complete: () => this.toggleLoading()
    })
  }

  onScrollDown() {
    this.toDisplay += 5;

    if (this.banniereCompList) {
      //this.banniereCompList.forEach(comp => comp.load());
    }
  }

  onScrollUp() {
    this.toDisplay -= this.toDisplay > 5 ? 5 : 0;
  }

  onScroll = () => {
    this.currentPage++;
    this.appendData();
  }


  // this method will be called on scrolling the page
  appendData = () => {
    this.toDisplay += 5;
    if (this.banniereCompList) {
      //this.banniereCompList.forEach(comp => comp.load());
    }
    this.toggleLoading();

    this.infiniteScroll.getItems(this.currentPage, this.itemsPerPage).subscribe({
      next: response => this.produits = [...this.produits, ...response],
      complete: () => this.toggleLoading()
    })
  }
}
