import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/_services/user.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
// ENV
import { environment } from '@env';

@Component({
  selector: 'app-grille-transport',
  templateUrl: './grille-transport.component.html',
  styleUrls: ['./grille-transport.component.scss']
})
export class GrilleTransportComponent implements OnInit {

  environment = environment;

  // Set regroupant les différents types de transports qu'ACTN propose (colissimo...)
  typeTransport = new Set();

  // table contenant les données de la grille de transport
  grilleTransport: any;

  francoCap: number = this.environment.maxFranco; // cap au delas duquel on affiche "Pas de franco" pour le "Montant franco"
  weightCap: number = 99999; // cap au delas duquel on affiche "Au-delà" pour la "Valeur de tranche maximale en KG"

  htmlTransportInfos: SafeHtml = null;

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
    ) { }

  ngOnInit(): void {
    this.chargerGrille();
    this.chargerHtmlInfos();
  }

  // s'abonne au service qui recupere la grille, et rempli le set de transport
  chargerGrille(): void{
    this.userService.chargerGrille().subscribe(
      data => {
        data.forEach(element => {
          this.typeTransport.add(element.description);
        });
        this.grilleTransport = data;
      },
      err => {},
      () => {}
    );
  }

  chargerHtmlInfos(): void
  {
    this.http.get(
        `${environment.pagesHtml}grilles-transport.html`,
        {
          withCredentials: true,
          responseType: 'text'
        }
      )
      .pipe(take(1))
      .subscribe(
        (ret) =>
        {
          this.htmlTransportInfos = this.sanitizer.bypassSecurityTrustHtml(ret);
        },
        (error) =>
        {
        }
      );
  }

  // permet de filtrer les données suivant leur type de transport
  trierType(grilleTransport: any, type: string): any{
    return grilleTransport.filter(element => element.description === type);
  }

  // permet de récupérer le montant minimum ou le montant franco de chaque type de transport
  getMontant(grilleTransport: any, type: string, libele: string): any{
    return grilleTransport.filter(element => element.description === type)[0][libele];
  }

}
