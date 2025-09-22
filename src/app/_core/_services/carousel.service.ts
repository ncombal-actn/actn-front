import { Injectable } from '@angular/core';
// ENVIRONMENT VALUES
import { environment } from '@env';
// RXJS
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
// HTTP
import { HttpClient } from '@angular/common/http';
// SERVICES
import { StorageService } from '@core/_services';

@Injectable({
  providedIn: 'root'
})
export class CarouselService
{
  environment = environment;

  // carouselData: Observable<any> = null;

  /** Objet regroupant toutes les infos du carousel */
  private completeCarouselData: CarouselData = null;
  /** Observable de toutes les infos du carousel */
  public _carouselData: BehaviorSubject<CarouselData> = new BehaviorSubject<CarouselData>(null);

  /** Renvoie l'observable de toutes les infos du carousel   */
  public get carouselData(): Observable<CarouselData> {
    return this._carouselData.asObservable();
  }

  constructor(
    private storageService: StorageService,
    private http: HttpClient
  ) {
    this.initCarouselData();
  }

  /**
   * Lance 'ScanDirectory.php', et renvois les valeurs
   * @returns l'observable take(1) des valeurs du carousel
   */
  private getCompleteCarouselData(): Observable<CarouselData>
  {
    return (
      this.http.get<CarouselData>(`${environment.cacheApiUrl}/ScanDirectory.php`, { withCredentials: true, responseType: 'json' })
    )
    .pipe(take(1));
  }

  /** Initialise l'observable (_carouselData) de toute les infos nécéssaires à la création du carousel */
  initCarouselData(): void
  {
    this.getCompleteCarouselData()
    .subscribe(
      (ret) =>
      {
       let slides = ret.slides.reverse() || [];
       
        this.completeCarouselData = new CarouselData(slides, ret.displaymode);
        this._carouselData.next(this.completeCarouselData);
      }
    );
  }

}

/** Classe regroupant toutes les infos du carousel */
export class CarouselData
{
  /**
   * Type d'affichage attendu du carousel
   * @example
   * 'V' (Vertical)
   * 'H' (Horizontal)
   */
  displaymode: string;
  /**
   * Tableau des informations nécéssaires à la création des slides dans le carousel
   * - image : nom de l'image de la slide
   * - mode : mode d'ouverture du liens de la slide
   * - needtobelogged : est ce que l'utilisateur doit être connecté pour voir cette slide ?
   * - url : url cible quand on clique sur la slide
   * @example
   * {
   * image: "image-slider-a210120-zyxel.webp"
   * mode: "BLANK"
   * needtobelogged: false
   * url: "https://www.zyxel.com/fr/fr/solutions/trade-in-trade-up-20180627-089395.shtml"
   * }
   */
  slides: Array<{image: string, mode: string, needtobelogged: boolean, url: string}>;

  constructor(slides:Array<any>, displaymode:string = null)
  {
    this.slides = slides;
    this.displaymode = displaymode;
  }

}
