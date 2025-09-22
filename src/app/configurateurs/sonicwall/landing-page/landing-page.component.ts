import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { ConfigurateurService } from '@/configurateurs/configurateur.service';
import { Subject } from 'rxjs';
import { environment } from '@env';
import {faUpload} from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
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
