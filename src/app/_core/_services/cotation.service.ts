import { AllCotations, Cotation } from "@/_util/models/cotation";
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
// ENV
import { environment } from "@env";
// RXJS
import { BehaviorSubject, Observable, of } from "rxjs";
import { map, take, tap } from "rxjs/operators";
import { User } from "@/_util/models";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class CotationService {
  public nbrOfCriticalCotations = 0;
  // le nombre de jours en dessous duquel la cotation deviens critique si elle lui reste des produits non-commandés
  private _daysLeftForCotationToBeCritical: number =
    environment.daysLeftForCotationToBeCritical;
  user: User;
  constructor(
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    /*this.getCotations()
      .pipe(take(1))
      .subscribe((ret: any) => {
        const cotations: AllCotations = this.constructCotations(ret);
        this._cotations.next(cotations.valid);
        this._disabledCotations.next(cotations.invalid);
        this._allCotations.next(cotations.valid.concat(cotations.invalid));
        this.nbrOfCriticalCotations = this.countCriticalCotations(cotations.valid);
      });*/
  }

  private _cotations: BehaviorSubject<Cotation[]> = new BehaviorSubject<
    Cotation[]
  >([]);

  // VALUES
  public get cotations(): Cotation[] {
    return this._cotations.value;
  }

  private _disabledCotations: BehaviorSubject<Cotation[]> = new BehaviorSubject<
    Cotation[]
  >([]);

  public get disabledCotations(): Cotation[] {
    return this._disabledCotations.value;
  }

  private _allCotations: BehaviorSubject<Cotation[]> = new BehaviorSubject<
    Cotation[]
  >([]);

  public get allCotations(): Cotation[] {
    return this._allCotations.value;
  }

  // OBSERVABLES
  public get cotations$(): Observable<Cotation[]> {
    return this._cotations.asObservable();
  }

  public get disabledCotations$(): Observable<Cotation[]> {
    return this._disabledCotations.asObservable();
  }

  public get allCotations$(): Observable<Cotation[]> {
    return this._allCotations.asObservable();
  }

  /**
   * Récupère la liste des cotations d'un produit.
   */
  public getProduitCotations(referenceProduit: string): Observable<Cotation[]> {
    if (isPlatformBrowser(this.platformId)) {
      const storedCotations = localStorage.getItem("cotationData");
      let cotations: Cotation[] = [];

      if (storedCotations) {
        // Parse the stored data if it exists
        const parsedData = JSON.parse(storedCotations);


        // Assuming cotations is a property of the parsed data
        if (parsedData && parsedData.cotations) {
          cotations = parsedData.cotations;
        }
      }

      // Transform the cotations array into an observable using `from` or `of`
      return of(cotations).pipe(
        map((cotationsArray) =>
          cotationsArray.filter(
            (cotationLine) => cotationLine.produit === referenceProduit
          )
        )
      );
    }
  }

  /**
   * calcul la différence en jours entre date1 et date 2
   * en utilisant : date1 - date2
   */
  public dateDifferenceInDays(date1: Date, date2: Date): number {
    const diffTime: number = date1.valueOf() - date2.valueOf();
    const diffDays: number = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  public ddmmyyyyToDate(datestring: string): Date {
    const temp: string[] = datestring.split("/");
    const retDate = new Date(+temp[2], +temp[1], +temp[0]);
    return retDate;
  }

  public getInvalidReasons(invalidCotations: Cotation[]): Cotation[] {
    let currentDate = new Date();
    for (const invalidCotation of invalidCotations) { // ON COMPTE LES COTATIONS CRITIQUES
      if (invalidCotation.qtecdemax - invalidCotation.qtecde <= 0) {
        invalidCotation.invalidReason = "Tous les produits ont été commandés";
      } else if (invalidCotation.nbrcdemax - invalidCotation.nbrcde <= 0) {
        invalidCotation.invalidReason = "Commandes épuisées";
      } else if (invalidCotation.datefin.valueOf() < currentDate.valueOf()) {
        invalidCotation.invalidReason = "Cotation périmée";
      }
    }

    return invalidCotations;
  }

  private constructCotations(cotations: any[]): AllCotations {
    const constructedCotations: AllCotations = { valid: [], invalid: [] };

    if (cotations["valid"]) {
      for (const cot of cotations["valid"]) {
        constructedCotations.valid.push(new Cotation(cot));
      }
    } else {
      constructedCotations.valid = [];
    }

    if (cotations["invalid"]) {
      for (const cot of cotations["invalid"]) {
        constructedCotations.invalid.push(new Cotation(cot));
      }
    } else {
      constructedCotations.invalid = [];
    }
    return constructedCotations;
  }

  private setCotationsInSession(cotations: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("cotations", JSON.stringify(cotations));
    }
  }
  public getCotationsFromSession(): any | null {
    if (isPlatformBrowser(this.platformId)) {
      // Only access localStorage if running in the browser

      const cotations = localStorage.getItem("cotationData");
      return cotations ? JSON.parse(cotations) : null;
    }

     const cotations = localStorage.getItem("cotationData");
      return cotations ? JSON.parse(cotations) : null;
  }

  public getCotations(): void {
    this.httpClient
      .get<AllCotations>(`${environment.apiUrl}/ListeCotations.php`, {
        withCredentials: true,
        responseType: "json",
      })
      .pipe(take(1))
      .subscribe((ret: any) => {
        const cotations: AllCotations = this.constructCotations(ret);
        this._cotations.next(cotations.valid);
        this._disabledCotations.next(cotations.invalid);
        this._allCotations.next(cotations.valid.concat(cotations.invalid));
        this.nbrOfCriticalCotations = this.countCriticalCotations(
          cotations.valid
        );

        // Group data into a single object
        const cotationData = {
          cotations: cotations.valid,
          disabledCotations: cotations.invalid,
          allCotations: cotations.valid.concat(cotations.invalid),
          nbrOfCriticalCotations: this.nbrOfCriticalCotations,
        };
        if (isPlatformBrowser(this.platformId)) {
          // Store data in localStorage
          localStorage.setItem("cotationData", JSON.stringify(cotationData));
        }
      });
  }

  clearCotations(): void {
    localStorage.removeItem("cotationData");
    this._cotations.next([]); // Clear locally stored cotations as well
    this._disabledCotations.next([]);
    this._allCotations.next([]);
    this.nbrOfCriticalCotations = 0;
  }

  fetchCotationsFromServer(): void {
    this.httpClient
      .get(`${environment.apiUrl}/ListeCotations.php`)
      .pipe(
        take(1),
        map((ret: any) => this.constructCotations(ret)),
        tap((cotations: AllCotations) => {
          const validCotations = cotations.valid;
          this._cotations.next(validCotations);
          this.nbrOfCriticalCotations =
            this.countCriticalCotations(validCotations);

          // Store cotations in localStorage
          localStorage.setItem("cotations", JSON.stringify(validCotations));
        })
      )
      .subscribe();
  }

  /**
   * Récupère une liste de cotations.
   */
  public getCot(): Observable<AllCotations> {
    return this.httpClient.get<AllCotations>(
      `${environment.apiUrl}/ListeCotations.php`,
      {
        withCredentials: true,
        responseType: "json",
      }
    );
  }

  private countCriticalCotations(cotations: Cotation[]): number {
    const tempCurrentDate: Date = new Date();
    let count = 0;
    for (const cot of cotations) {
      const datediff = this.dateDifferenceInDays(cot.datefin, tempCurrentDate);
      if (
        datediff > 0 &&
        datediff <= this._daysLeftForCotationToBeCritical &&
        cot.qtecde < cot.qtecdemax
      ) {
        count++;
      }
    }
    return count;
  }
}
