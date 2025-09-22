import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProduitService} from '@core/_services/produit.service';
import {AuthenticationService} from '@core/_services/authentication.service';
import {CarouselData, CarouselService} from '@core/_services/carousel.service';
import {Produit} from '@/_util/models';
import {News} from '@services/news.service';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {catchError, map, take, takeUntil} from 'rxjs/operators';
import {HttpClient} from "@angular/common/http";
import {environment} from "@env";

/**
 * Composant représentant la page d'accueil.
 *
 * Essayez d'éviter la tentation de mettre un slideshow / carousel,
 * mauvaise pratique pour l'expérience utilisateur.
 * L'apport d'un slideshow n'est que purement esthétique, valeur qui peut être apportée
 * par d'autres moyens qui ne prennent pas 50% de la page et autant de temps de maintenance.
 * https://conversionxl.com/blog/dont-use-automatic-image-sliders-or-carousels/
 *
 *
 */
@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit, OnDestroy {

  produits$: Observable<Array<Produit>>;
  news$: Observable<Array<News>>;
  carouselData$: BehaviorSubject<CarouselData> = new BehaviorSubject<CarouselData>(null);
  carouselData: CarouselData = null;
  authReloadCarousel: Subject<void> = new Subject<void>();
  private _destroy$ = new Subject<void>(); //

  constructor(
    private produit: ProduitService,
    private carouselService: CarouselService,
    private authenticationService: AuthenticationService,
    private http: HttpClient
  ) {
  }

  /**
   * Initialisation de AccueilComponent
   * - Récupération des nouveaux produits
   * - Récupération des nouveautés du blog ACTN
   * - Abonnement au changement d'utilisateur pour rechargant les informations du carousel
   */
  ngOnInit(): void {

    this.produits$ = this.produit.getPromos('N', '').pipe(take(1));
    this.news$ = this.getLatestNews();

    this.produits$.subscribe((produits) => {console.log('Produits récupérés:', produits);
    })
    // CHARGEMENT DES DATAS DU CARROUSEL
    //   et reload lors du changement d'état de l'utilisateur
    this.authenticationService.currentUser$
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (newUser) => {
          this.carouselService.carouselData.pipe(takeUntil(this._destroy$)).subscribe(
            (ret: CarouselData) => {
              if (ret != null) {
                this.carouselData = new CarouselData(ret.slides, ret.displaymode);
                if (!newUser) {
                  this.carouselData.slides = this.carouselData.slides.filter(slide => !slide.needtobelogged);
                }
                this.carouselData$.next(this.carouselData);
                this.carouselData.displaymode = 'H'
              }
            });
        });
  }

  getLatestNews(): Observable<Array<News>> { 
          return this.http.get(`${environment.cacheApiUrl}/xmllecture.php`, {
              withCredentials: true
          }).pipe(
              take(1),
              map((fetchedNews) => {    
                  const news = new Array<News>();
                  for (const _news of Object.values(fetchedNews)) {
                      const actu = new News();
                      actu.title = _news.title;
                      actu.link = _news.link;
                      actu.comments = _news.link;
                      actu.date = _news.date; 
                      actu.description = _news.image;
                      news.push(actu);
                  }
                 
                  return news;
              }),
              catchError((error) => {
                console.error('Error fetching news:', error);
                return of([]); // Return an empty array in case of error
              })
              
          );
    
  }


    /**
     * Destruction de AccueilComponent
     */
    ngOnDestroy()
  :
    void
      {
        this._destroy$.next();
        this._destroy$.complete();
      }
  }


  