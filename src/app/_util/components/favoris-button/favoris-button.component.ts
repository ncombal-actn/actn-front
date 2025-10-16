import { Component, OnInit, OnDestroy, Input } from '@angular/core';
// RXJS
import { Subscription } from 'rxjs';
// SERVICES
import { FavorisService } from '@/_core/_services/favoris.service';
import {TooltipComponent} from "@/_util/components/tooltip/tooltip.component";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-favoris-button',
  standalone: true,
  templateUrl: './favoris-button.component.html',
  imports: [
    TooltipComponent,
    MatTooltip
  ],
  styleUrls: ['./favoris-button.component.scss']
})
export class FavorisButtonComponent implements OnInit, OnDestroy {

    @Input() produitReference: string;
    @Input() displayAsXIcon: boolean = false;

    // est ce que 'produitReference' est dans les favoris ?
    inFav: boolean;
    // liste multi onglet des favoris
    referencesOfFavoris: string[] = null;
    // subscription au FavorisService
    favorisSubscription: Subscription = null;

    constructor(
        public favorisService: FavorisService
    ) { }

    ngOnInit(): void {
        // set up
        this.referencesOfFavoris = this.favorisService.setUp();
        if (this.referencesOfFavoris.includes(this.produitReference)) {
            this.inFav = true;
        }
        else {
            this.inFav = false;
        }

        // subscribe
        this.favorisSubscription = this.favorisService.favoris()
            .subscribe(
                (ret) => {
                    this.referencesOfFavoris = ret;
                    if (ret.includes(this.produitReference)) {
                        this.inFav = true;
                    }
                    else {
                        this.inFav = false;
                    }
                },
                (error) => {
                }
            );
    }

    ngOnDestroy() {
        if (this.favorisSubscription != null) {
            this.favorisSubscription.unsubscribe();
        }
    }

    // FAVORIS SERVICE
    /////////////////////////////////////////////////////////////////////////////////

    toggleThisProductInFavorisService(): void {
        this.favorisService.toggleFavoris(this.produitReference);
    }

    /////////////////////////////////////////////////////////////////////////////////

}
