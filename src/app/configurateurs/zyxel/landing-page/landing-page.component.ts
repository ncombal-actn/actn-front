import { ConfigurateurService } from '@/configurateurs/configurateur.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SvgService } from '@core/_services';
import { environment } from '@env';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import {faUpload} from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy {

    environment = environment;

    isLoaded = false;
    titre = '';
    titreColonnes: string[] = [];
    colonnes: string[] = [];
    showLoadPopup = false;

    protected _destroy$ = new Subject<void>();

    constructor(
        public configService: ConfigurateurService,
        public svg: SvgService
    ) { }

    ngOnInit(): void {
        this.configService.loading$
			.pipe(takeUntil(this._destroy$), filter(isLoading => !isLoading))
			.subscribe(() => {
                const cols = this.configService.textes.get('LANDINGPAGE');
                this.titre = cols.get('LANDINGPAGE');
                for (const [key, value] of cols.entries()) {
                    if (key !== 'LANDINGPAGE') {
                        const arr = value.split('$\r\n');
                        this.titreColonnes.push(arr[0]);
                        this.colonnes.push(arr[1]);
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
