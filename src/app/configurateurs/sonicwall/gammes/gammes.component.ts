import { ConfigurateurService } from '@/configurateurs/configurateur.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SvgService } from '@core/_services';
import { environment } from '@env';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import {RouterLink} from "@angular/router";
import {AsyncPipe} from "@angular/common";
import {HeaderStepperComponent} from "@/configurateurs/sonicwall/header-stepper/header-stepper.component";

@Component({
  selector: 'app-gammes',
  standalone: true,
  templateUrl: './gammes.component.html',
  imports: [
    RouterLink,
    AsyncPipe,
    HeaderStepperComponent
  ],
  styleUrls: ['./gammes.component.scss']
})
export class GammesComponent implements OnInit, OnDestroy {

    public environment = environment;

    public gammes: { titre: string, texte: string }[] = [];
    public ss = new Map<string, string>();
    public crit = new Map<string, string>();
    public modelesCount = [];

    private _destroy$ = new Subject<void>();

    constructor(
        private configService: ConfigurateurService,
        public svg: SvgService
    ) { }

    ngOnInit(): void {
        this.configService.loading$
            .pipe(takeUntil(this._destroy$), filter(isLoading => !isLoading))
            .subscribe(() => {
                for (const [key, value] of this.configService.textes.entries()) {
                    if (key !== 'LANDINGPAGE') {
                        this.gammes.push({ titre: key, texte: value.get(key) });
                        this.ss.set(key, value.get(key + '_SS'));
                        this.crit.set(key, value.get(key + '_Crit'));
                    }
                }
                this.gammes = this.gammes.reverse();
                this.gammes.forEach(gamme => this.modelesCount.push(this.configService.modeles.filter(modele => modele.crits.Gamme.value === gamme.titre).length));
            });
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

}
