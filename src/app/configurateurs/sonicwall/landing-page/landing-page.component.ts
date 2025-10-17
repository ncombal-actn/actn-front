import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { ConfigurateurService } from '@/configurateurs/configurateur.service';
import { Subject } from 'rxjs';
import { environment } from '@env';
import {faUpload} from "@fortawesome/free-solid-svg-icons";
import {RouterLink} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {BanniereComponent} from "@/banniere/banniere.component";
import {ChargementComponent} from "@/configurateurs/sonicwall/sauvegarde/chargement/chargement.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  imports: [
    RouterLink,
    FaIconComponent,
    BanniereComponent,
    ChargementComponent
  ],
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy {

    public environment = environment;

    public titre = '';
    public colonnes = [];
    public isLoaded = false;

    private _destroy$ = new Subject<void>();

    constructor(
        public configService: ConfigurateurService,
    ) { }

    ngOnInit(): void {
        this.configService.loading$
            .pipe(takeUntil(this._destroy$), filter(isLoading => !isLoading))
            .subscribe(() => {
                const cols = this.configService.textes.get('LANDINGPAGE');
                this.titre = cols.get('LANDINGPAGE');
                for (const [key, value] of cols.entries()) {
                    if (key !== 'LANDINGPAGE') {
                        this.colonnes.push(value);
                    }
                }
                this.isLoaded = true;
            });
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

  protected readonly faUpload = faUpload;
}
