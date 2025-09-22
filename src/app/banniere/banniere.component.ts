import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { AuthenticationService, SeoService } from "@core/_services";
import { environment } from "@env";
import { Observable } from "rxjs";

@Component({
  selector: "app-banniere",
  templateUrl: "./banniere.component.html",
  styleUrls: ["./banniere.component.scss"],
})
export class BanniereComponent implements OnInit {
  @Input() emplacement: string;
  listBanniere: Array<string>;
  banniereActiveList: Array<string> = [];
  sort: number;
  banniereActive = "";
  linkActive = "";
  environment = environment;
  affichage = false;


  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private seoService: SeoService,        private authService:  AuthenticationService) {}

  private _marques: Array<string> = [];

  public get marques(): Array<string> {
    return this._marques;
  }

  imageExists = false;
  @Input() public set marques(value: Array<string>) {
    this._marques = value;
    this.load();
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.banniereActiveList = [];
    this.banniereActive = undefined;
    this.affichage = false;

    this.chargerListBanniere().subscribe((ret) => {
      this.listBanniere = ret.split(/[\r\n]+/g);
      for (const banniere of this.listBanniere) {
        for (const marque of this._marques) {
          if (
            marque === banniere.split("_")[0].toLocaleUpperCase() &&
            this.emplacement === banniere.split("_")[1]
          ) {
            this.banniereActiveList.push(banniere);
          }
        }
      }

      if (this.banniereActiveList.length !== 0) {
        this.sort = this.getRandomInt(this.banniereActiveList.length);
        this.banniereActive = this.banniereActiveList[this.sort];
        this.checkImageExists();
        this.affichage = true;
        this.recupLink().subscribe((retour) => {
          this.linkActive = retour;
        });
      }
    });
    this.cdr.detectChanges();
  }

  checkImageExists(): void {
    const imageUrl = `${environment.banniereUrl}${this.banniereActive}.webp`;
    this.http.head(imageUrl, { observe: "response" }).subscribe(
      (response) => {
        if (response.status === 200) {
          this.imageExists = true;
        } else {
          this.imageExists = false;
        }
      },
      (error) => {
        this.imageExists = false;
      }
    );
  }

  /**
   * Charge la liste de toutes les bannières.
   */
  chargerListBanniere(): Observable<string> {
    return this.http.get(`${environment.banniereUrl}/listBannieres.txt`, {
      responseType: "text",
    });
  }

  /**
   * Génère un nombre aléatoire entre 0 et un chiffre maximum.
   * @param max Le chiffre maximum
   * @return Un nombre aléatoire entre 0 et max
   */
  getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
  }

  /**
   *
   */
  recupLink(): Observable<any> {
    return this.http.get(
      `${environment.banniereUrl}/${this.banniereActive}.txt`,
      {
        responseType: "text",
      }
    );
  }
  emitSeo(){
    console.log('smich');
    
    this.seoService.logEvent('click_banniere', { 
    client: this.authService.currentUser,
    banniere: this.banniereActive,
  });
  }
onBanniereClick(event: MouseEvent) {
  event.preventDefault(); // Empêche la navigation immédiate
  this.emitSeo();         // Log SEO

  // Redirige manuellement après le log
  window.location.href = this.linkActive;
}

}
