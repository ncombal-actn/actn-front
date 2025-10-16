import { Component, OnInit, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";

// RXJS
import { Subject } from "rxjs";
import { take, share, takeUntil } from "rxjs/operators";

// SERVICES
import { AuthenticationService } from "@/_core/_services/authentication.service";

// ENVIRONMENT
import { environment } from "@env";
import {AnimatedBoxComponent} from "@/_util/components/animated-box/animated-box.component";

@Component({
  selector: "app-outils",
  standalone: true,
  imports: [
    AnimatedBoxComponent
  ],
  templateUrl: "./outils.component.html",
  styleUrls: ["./outils.component.scss"],
})
export class OutilsComponent implements OnInit, OnDestroy {
  // ATTRIBUTS

  public environment = environment;
  public userIsConnected: boolean = false;

  public outils: any = undefined; // retour de ListeOutils.php
  public outilsKeys: string[] = [];
  public sortedOutils: any = {}; //Array<{categorie: string, outils: Array<any>}> = new Array<{categorie: string, outils: Array<any>}>();
  public sortedOutilsKeys: string[] = [];

  colors: string[] = [
    /*ACTN*/ "#003264",
    /*ORANGE*/ "#ff6801",
    /*VERT*/ "#64be00",
    /*ROUGE*/ "#c20e1a",
    /*JAUNE*/ "#f9b62a",
    /*BLEU*/ "#005bcb",
    /*DARK GREY*/ "#3b3b3b",
    /*MAGENTA*/ "#ff2c3b",
    /*CYAN*/ "#00b2ff",
  ];

  private _destroy$ = new Subject<void>();

  // INITIALISATION

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    // récupération des outils
    this.http
      .get(`${environment.cacheApiUrl}/ListeOutils.php`, {
        withCredentials: true,
        responseType: "json",
      })
      .pipe(take(1))
      .subscribe(
        (ret) => {
          this.outils = ret;
          this.outilsKeys = Object.keys(ret);

          this.sortOutils(this.outils);
        },
        (error) => {
          this.outils = null;
        }
      );

    this.subscriptionToUser();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  sortOutils(outils: any): void {
    let outilsKeys: Array<string> = Object.keys(outils);
    let i: number = 0;
    let iend: number = outilsKeys.length;
    let currentOutil: any = null;

    while (i < iend) {
      currentOutil = outils[outilsKeys[i]];

      if (this.sortedOutils[currentOutil.categorie]) {
        this.sortedOutils[currentOutil.categorie].outils.push(currentOutil);
      } else {
        this.sortedOutils[currentOutil.categorie] = {
          categorie: currentOutil.categorie,
          outils: [currentOutil],
        };
      }
      i++;
    }
    this.sortedOutilsKeys = Object.keys(this.sortedOutils);
  }

  subscriptionToUser(): void {
    // lance le subscribe à chanque changement d'user
    this.authenticationService.currentUser$
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (ret) => {
          if (ret) {
            this.userIsConnected = true;
          }
        },
        (error) => {
          console.error(
            "In OutilsComponent, subscriptionToUser failed !",
            error
          );
        }
      );
  }
}
