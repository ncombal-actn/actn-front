import { ConfigurateurService, Modele } from '@/configurateurs/configurateur.service';
import { Breakpoints } from '@/_util/enums';
import { Produit } from '@/_util/models';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, Inject, Input, NgZone, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { AuthenticationService, SvgService, WindowService } from '@core/_services';
import { ProduitService } from '@core/_services/produit.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { SlidingListeComponent as BaseSlidingListeComponent } from '@/_util/components/sliding-liste/sliding-liste.component';
import {faChevronRight, faFilePdf} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {AsyncPipe, CurrencyPipe, NgTemplateOutlet} from "@angular/common";
import {RouterLink} from "@angular/router";
import {InputNumberComponent} from "@/configurateurs/zyxel/input-number/input-number.component";

@Component({
  selector: 'conf-sliding-liste',
  standalone: true,
  templateUrl: './sliding-liste.component.html',
  imports: [
    FaIconComponent,
    NgTemplateOutlet,
    AsyncPipe,
    RouterLink,
    InputNumberComponent,
    CurrencyPipe
  ],
  styleUrls: ['./sliding-liste.component.scss']
})
export class SlidingListeComponent extends BaseSlidingListeComponent implements OnInit {

    @Output() qteProduit = new EventEmitter<{ qte: number, produit: Produit }>();

    @Input() color = 1;
    @Input() isModeles = true;
    @Input() set produits(value: Modele[] | Produit[]) {
        if (this.isModeles) {
            if (value != null && value.length > 0) {
                this._produits$.next((value as Modele[]).sort((a, b) => a.produit.localeCompare(b.produit)));
                setTimeout(() => this.resizeElements());
            } else {
                this._produits$.next([]);
            }
        } else {
            if (value != null && value.length > 0) {
                this._produits$.next((value as Produit[]).sort((a, b) => a.reference.localeCompare(b.reference)));
                setTimeout(() => this.resizeElements());
            } else {
                this._produits$.next([]);
            }
        }
    }
    get produits(): Array<Modele> | Array<Produit> {
        return this._produits$.getValue();
    }

    get produits$(): Observable<Array<Modele> | Array<Produit>> {
        return this._produits$.asObservable();
    }

    stringFromDetails(details: string[]): string {
        if (details && details.length > 0) {
            if (details.some(d => d.includes('§'))) {
                return this.produitService.fullString(details);
            } else {
                return ' ●\t' + details.join('\n ●\t');
            }
        } else {
            return '';
        }
    }

    protected _produits$ = new BehaviorSubject<Modele[] | Produit[]>([]);

    constructor(
        protected produitService: ProduitService,
        protected auth: AuthenticationService,
        protected window: WindowService,
        protected breakpointObserver: BreakpointObserver,
        protected ngZone: NgZone,
        @Inject(PLATFORM_ID) protected platformId: any,
        public svg: SvgService,
        protected configService: ConfigurateurService
    ) {
        super(produitService, auth, window, breakpointObserver, ngZone, platformId);
    }

    ngOnInit(): void {
        this._listenBreakpoints();
        this._listenResize();
    }

    onResize(): void {
        switch (this._breakpointState) {
            case Breakpoints.GT1650:
                this.nbItems = 4;
                break;
            case Breakpoints.GT1300GE1650:
                this.nbItems = 3;
                break;
            case Breakpoints.GT900GE1300:
                this.nbItems = 2;
                break;
            case Breakpoints.LE900:
                this.nbItems = 1;
                break;
            default:
                this.nbItems = 1;
                break;
        }
        this.showing = this.nbItems;
        this.resizeElements();
    }

    equipementValueChange(value: number, produit: Produit): void {
        this.qteProduit.emit({ qte: value, produit });
    }

    quantiteOf(produit: string, category: string): number {
        return this.configService.configuration.getOptions('Équipement additionnel', category)?.find(option => option?.option?.['produit'].value === produit)?.quantite ?? 0;
    }

  protected readonly faChevronRight = faChevronRight;
  protected readonly faFilePdf = faFilePdf;
}
