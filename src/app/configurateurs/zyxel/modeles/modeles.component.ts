import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {environment} from '@env';
import {Subject} from 'rxjs';
import {filter, take, takeUntil} from 'rxjs/operators';
import {ConfigurateurService, Modele} from '../../configurateur.service';
import {HeaderStepperComponent} from "@/configurateurs/zyxel/header-stepper/header-stepper.component";

@Component({
  selector: 'app-modeles',
  standalone: true,
  imports: [
    HeaderStepperComponent
  ],
  templateUrl: './modeles.component.html',
  styleUrls: ['./modeles.component.scss']
})
export class ModelesComponent implements OnInit, OnDestroy {

  environment = environment;
  gamme = {titre: '', texte: ''};
  couleurGamme = 1;
  modeles: Modele[];
  isReady = false;

  private _destroy$ = new Subject<void>();

  constructor(
    private configService: ConfigurateurService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.configService.loading$
      .pipe(takeUntil(this._destroy$), filter(isLoading => !isLoading))
      .subscribe(() => {
        this.route.paramMap.pipe(take(1)).subscribe(route => {
          const nomGamme = route.get('gamme');
          this.gamme = {titre: nomGamme, texte: this.configService.textes.get(nomGamme).get(nomGamme)};
          this.modeles = this.configService.modeles.filter(modele => nomGamme.startsWith(modele.crits['Gamme'].value));
          this.isReady = true;
        });
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
