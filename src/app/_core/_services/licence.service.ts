import { environment } from "@env";
import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";

import { Client, Filtre, Licence, RawLicence, User } from "@/_util/models";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { StorageService } from "./storage.service";
import { Router } from "@angular/router";
import { SnackbarService } from "@/_util/components/snackbar/snackbar.service";
import { LocalStorageService } from "./localStorage/local-storage.service";
import { FiltreDate } from "@/espace-client/contrats/contrats.component";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: "root",
})
export class LicenceService {
  public details = new Array<boolean>();
  public user = new User();
  public scroll = 0;
  public paginator = {
    pageIndex: 0,
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50, 100],
    previousPageIndex: -1,
    low: 0,
    high: 10,
  };

  filtreTout = "voir toutes les licences";
  filtresSerie;
  filtresExpirant = [
    "expirant dans moins de 7 jours",
    "expirant dans moins de 15 jours",
    "expirant dans moins de de 30 jours",
  ];
  filtresExpire = [
    "expirée dans les 15 derniers jours",
    "expirée dans les 30 derniers jours",
    "expirée dans les 3 derniers mois",
  ];
  filtresDate: Array<FiltreDate> = [
    { label: "Arrive à expiration", options: this.filtresExpirant },
    { label: "Récemment expirée", options: this.filtresExpire },
  ];
  selectedFiltreDate = this.filtreTout;
  filtreValues: Array<unknown> = [];
  selectedTri: [string, string] = ["Date d'expiration", "desc"];

  public marques = new Set<string>();
  protected _filtres: Array<Filtre> = [];
  protected _oldest: Date;
  protected _newest: Date;
  protected _now: Date;
  protected _renouvelable = 0;
  protected _nbLicences = 0;
  public licences$: Observable<Array<Licence>> = new Observable();

  /** ✅ Lazy injection d'AuthenticationService */
  private _authService: AuthenticationService | null = null;
  private get authService(): AuthenticationService {
    if (!this._authService) {
      this._authService = this.injector.get(AuthenticationService);
    }
    return this._authService;
  }

  protected _prioritaire = 0;

  constructor(
    protected httpClient: HttpClient,
    protected storageService: StorageService,
    protected router: Router,
    protected injector: Injector, // injecteur pour lazy AuthenticationService
    protected snackbarService: SnackbarService,
    protected localStorage: LocalStorageService
  ) {
    this._oldest = new Date();
    this._newest = new Date();
    this._now = new Date();
    this._oldest.setMonth(this._now.getMonth() - 3);
    this._newest.setDate(this._now.getDate() + 30);
  }

  public get prioritaire(): number {
    return this._prioritaire;
  }

  /** Retourne les licences d'un client */
  public getLicences(): void {
    this.licences$ = this.httpClient
      .get<Array<RawLicence>>(`${environment.apiUrl}/ListeLicences.php`, {
        withCredentials: true,
      })
      .pipe(
        map((rLicences) => {
          let licences = new Array<Licence>();
          rLicences.forEach((rLicence) => {
            if (rLicence.produit.length > 0) {
              licences.push(new Licence(rLicence));
            }
          });

          licences = licences.sort(
            (l1, l2) =>
              l2.commande.datecommande.getTime() -
              l1.commande.datecommande.getTime()
          );

          const licencesMap = new Map<string, Licence>();
          const licenceSansSerie = new Array<Licence>();

          for (const licence of licences) {
            if (licence.serie === "" || licence.serie.toLowerCase() === "n.c.") {
              licenceSansSerie.push(licence);
            } else {
              const licenceMap = licencesMap.get(licence.serie);
              if (licenceMap != null) {
                licenceMap.history.push(licence);
              } else {
                licencesMap.set(licence.serie, licence);
              }
            }
          }

          if (licencesMap.size !== this._nbLicences) {
            this._resetAttributs();
          }
          this._nbLicences = licencesMap.size;

          const licencesData = {
            licences: Array.from(licencesMap.values()).concat(licenceSansSerie),
            nbLicences: this._nbLicences,
          };

          localStorage.setItem("licences", JSON.stringify(licencesData));

          return licencesData.licences;
        })
      );

    this.licences$.pipe(take(1)).subscribe();
  }

  clearLicences(): void {
    this.localStorage.removeItem("licences");
    this._nbLicences = 0;
  }

  public getFiltres(): Observable<Array<Filtre>> {
    this._filtres = [];
    return new Observable((obs) => {
      this._filtres.push({
        target: "produit.marque",
        label: "Marque",
        type: "array",
        method: "includes",
        forme: "select",
        options: [],
      });
      this._filtres.push({
        target: "statut",
        label: "Statut",
        type: "array",
        method: "includes",
        forme: "select",
        options: ["En attente", "Active", "Expirée"],
      });
      this._filtres.push({
        target: "produit.reference",
        label: "Ref. Produit",
        type: "string",
        method: "includes",
        forme: "input",
        options: [],
      });
      this._filtres.push({
        target: "serie",
        label: "SN / EAV",
        type: "string",
        method: "includes",
        forme: "input",
        options: [],
      });
      this._filtres.push({
        target: "client.nom",
        label: "Client final",
        type: "string",
        method: "includes",
        forme: "input",
        options: [],
      });
      obs.next(this._filtres);
      obs.complete();
    });
  }

  public checkLicences(showSnackbar = true): void {
    this.licences$.pipe(take(1)).subscribe((licences: Array<Licence>) => {
      this._prioritaire = 0;
      this._renouvelable = 0;
      licences.forEach((licence: Licence) => {
        this._prioritaire +=
          !this.isIgnored(licence) && this.isPrioritaire(licence) ? 1 : 0;
        this._renouvelable +=
          !this.isIgnored(licence) && this.isRenewable(licence) ? 1 : 0;
      });

      if (showSnackbar && this._prioritaire > 0) {
        let message =
          "Une ou plusieurs de vos licences nécessitent votre attention :";
        message +=
          this._prioritaire > 0
            ? "\n- " +
            this._prioritaire +
            " licence" +
            (this._prioritaire > 1
              ? "s arrivent ou sont arrivées à expiration"
              : " arrive ou est arrivée à expiration")
            : "";
        message +=
          this._renouvelable > 0
            ? "\n- " +
            this._renouvelable +
            " licence" +
            (this._renouvelable > 1 ? "s sont renouvelables" : " est renouvelable")
            : "";
        this.snackbarService.showSnackbar(
          message,
          "Voir les licences",
          () => this.router.navigateByUrl("/espace-client/contrats"),
          15000
        );
      }
    });
  }

  public getEnduserFormulaireRaw(): Observable<any> {
    return this.httpClient.get<Map<string, any>>(
      `${environment.apiUrl}/EnduserFormulaire.php`,
      { withCredentials: true }
    );
  }

  public getEnduserFormulaire(): Observable<Map<string, Map<string, boolean>>> {
    return this.getEnduserFormulaireRaw().pipe(
      map((formulaire) => {
        formulaire = new Map(Object.entries(formulaire));
        const ret = new Map<string, Map<string, boolean>>();
        for (const key of formulaire.keys()) {
          ret.set(key, new Map(Object.entries(formulaire.get(key))));
        }
        return ret;
      })
    );
  }

  public postEnduser(client: Client, numCommande?: string): Observable<any> {
    if (!client) return;
    return this.httpClient.post(
      `${environment.apiUrl}EnduserSET.php`,
      {
        nom: client.nom,
        mail: client.mail,
        telephone: client.telephone,
        adresse1: client.adresse1,
        adresse2: client.adresse2,
        codepostal: client.codepostal,
        ville: client.ville,
        pays: client.pays,
        serie: client.serie,
        ncde: numCommande ?? "",
        ntva: client.numtva,
      },
      {
        withCredentials: true,
        headers: new HttpHeaders({ "Content-Type": "application/json" }),
      }
    );
  }

  public majEnduser(): Observable<any> {
    return this.httpClient.get<any>(`${environment.apiUrl}/EnduserMAJ.php`, {
      withCredentials: true,
    });
  }

  public isPrioritaire(licence: Licence): boolean {
    return licence.renouvellementdate > this._oldest && licence.renouvellementdate <= this._newest;
  }

  public isRenewable(licence: Licence): boolean {
    return this.isPrioritaire(licence) || licence.statut === "Active";
  }

  public ignore(licence: Licence): void {
    let item = this.getIgnoredLicences();
    if (!item) item = new Set<string>();
    item.add(licence.commande + licence.serie);
    this.localStorage.setItem("ignoredLicences", JSON.stringify([...item]));
    this.checkLicences(false);
  }

  public follow(licence: Licence): void {
    let item = this.getIgnoredLicences();
    if (!item) item = new Set<string>();
    item.delete(licence.commande + licence.serie);
    this.localStorage.setItem("ignoredLicences", JSON.stringify([...item]));
    this.checkLicences(false);
  }

  public isIgnored(licence: Licence): boolean {
    const item = new Set<string>(JSON.parse(this.localStorage.getItem("ignoredLicences")));
    return item?.has(licence.commande + licence.serie);
  }

  public demandeDevis(licence: Licence, nbPostes: number, duree: string): Observable<any> {
    return this.httpClient.post(
      `${environment.apiUrl}/LicenceAjoutPostes.php`,
      { numcommande: licence.commande, refproduit: licence.produit, noserie: licence.serie, nbpostes: nbPostes, duree },
      { withCredentials: true }
    );
  }

  public demandeAide(licence: Licence, commentaire: string): Observable<any> {
    return this.httpClient.post(
      `${environment.apiUrl}/LicenceAide.php`,
      { numcommande: licence.commande, refproduit: licence.produit, noserie: licence.serie, commentaire },
      { withCredentials: true }
    );
  }

  private getIgnoredLicences(): Set<string> {
    return new Set<string>(JSON.parse(this.localStorage.getItem("ignoredLicences")));
  }

  private _resetAttributs(): void {
    this.user = this.authService.currentUser;
    this.details = [];
    this.scroll = 0;
    this.paginator = {
      pageIndex: 0,
      pageSize: 10,
      pageSizeOptions: [5, 10, 25, 50, 100],
      previousPageIndex: -1,
      low: 0,
      high: 10,
    };
    this.selectedFiltreDate = this.filtreTout;
    this.selectedTri = ["Date d'expiration", "desc"];
    this.filtresSerie = [""];
  }
}
