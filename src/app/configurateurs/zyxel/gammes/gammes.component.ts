import {ConfigurateurService} from '@/configurateurs/configurateur.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '@env';
import {Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {faSlidersH} from "@fortawesome/free-solid-svg-icons";
import {HeaderStepperComponent} from "@/configurateurs/zyxel/header-stepper/header-stepper.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-gammes',
  standalone: true,
  imports: [
    HeaderStepperComponent,
    FaIconComponent,
    RouterLink
  ],
  templateUrl: './gammes.component.html',
  styleUrls: ['./gammes.component.scss']
})
export class GammesComponent implements OnInit, OnDestroy {

  environment = environment;
  gammes: { titre: string, texte: string }[] = [];
  modelesCount = [];

  private _destroy$ = new Subject<void>();

  constructor(
    private configService: ConfigurateurService
  ) {
  }

  ngOnInit(): void {
    this.configService.loading$
      .pipe(takeUntil(this._destroy$), filter(isLoading => !isLoading))
      .subscribe(() => {
        for (const [key, value] of this.configService.textes.entries()) {
          if (key !== 'LANDINGPAGE') {
            this.gammes.push({titre: key, texte: value.get(key)});
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

  protected readonly faSlidersH = faSlidersH;
}
