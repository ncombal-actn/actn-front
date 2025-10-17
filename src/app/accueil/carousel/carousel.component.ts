import { AfterViewInit, ChangeDetectorRef, Component, Inject, Input, OnDestroy, PLATFORM_ID } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { environment } from '@env';
import { StorageService, WindowService } from '@core/_services';
import { Router } from '@angular/router';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import {isPlatformBrowser, NgClass} from '@angular/common';
import { CarouselData } from '@core/_services/carousel.service';
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";


@Component({
  selector: 'app-carousel',
  standalone: true,
  templateUrl: './carousel.component.html',
  imports: [
    NgClass,
    FaIconComponent
  ],
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements  OnDestroy, AfterViewInit
{
  /**
   * Observable de toutes les infos permettant la création du CarouselComponent
   * Se déclanche à chaque changement d'utilisateurs
   */
  @Input() carouselData$: BehaviorSubject<CarouselData>;
  /** Toutes les infos permettant la création du CarouselComponent */
  carouselData: CarouselData = null;

  /** Parametres de l'animation du carousel
   * @example
   * { duration: 500, interval: 5000 }
   */
  animation: {duration: number, interval: number} = {
    duration: 500,
    interval: 5000,
  };

  /** URL du dossier de l'environment où trouver les images du carousel */
  protected url: string;
  /** Tableau des URLs absolues et completes des images du carousel */
  public slides: Array<string> = [];
  /** Position actuelle du carousel dans la liste de slides (compris entre 1 et slides.length) */
  protected step = 1;
  /** L'ID actuel du timeOut qui fait défiler periodiquement le carousel */
  protected timeOutID = null;
  /** Bool true quand les boutons du carousel sont désactivés */
  protected disabled = false;

  /** Tableau d'informations des slides */
  images: CarouselData["slides"];

  /** Bool true quand la souris de l'utilisateur est au dessus du carousel */
  isHovering = false;

  /** Observable de nettoyage, déclanchée à la destruction du composant */
  private _destroy$ = new Subject<void>();

  constructor(
    private storageService: StorageService,

    private router: Router,

    private windowService: WindowService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.url = environment.carouselUrl;
  }

  /**
   * REQUETE ET PARAMETRAGE
   * THEN Slider settings and parameters
   * THEN Start the automatic sliding
   */


  /** Destruction du CarouselComponent */
  ngOnDestroy()
  {
    this.stopTimeOut();
    this._destroy$.next();
    this._destroy$.complete();
  }

  ngAfterViewInit(){
    this.carouselData$ // init carousel and reload when user changes
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (newCarouselData: CarouselData) =>
        {


          this.carouselData = newCarouselData;
          this.initCarousel();



        }
      );
  }

  /** Initialise les slides du carousel */
  protected initCarousel(): void
  {
    this.slides = [];
    this.images = this.carouselData.slides;
    this.step = 1;
    this.stopTimeOut();
    for (let i = 0; i <= (this.images.length -1 ); i++) {
      this.slides.push(this.url + this.images[i].image);
    }

    this.setSlider();
  }
  /** Paramètre le CSS du carousel pour chaque slides */

    // Start the automatic sliding
  protected setSlider = () => {


    if (isPlatformBrowser(this.platformId)) {



      // SLIDER SETTINGS
      const sliderElement = document.querySelector('.slider') as HTMLElement;

      if (sliderElement) {

        sliderElement.style.width = this.slides.length + '00%';
      }

      // RESET SLIDER POSITION
      const sliderContainer = document.querySelector('.slider') as HTMLElement;
      if (sliderContainer) {

        sliderContainer.style.left = '0';
      }

      // SLIDES SETTINGS
      let i = 0;


      setTimeout(() => {
        while (i < this.slides.length) {
          const zaza = document.querySelector('#carouselSlide' + (i + 1)) as HTMLElement;


          if (zaza) {
            zaza.style.backgroundImage = 'url(\'' + this.slides[i] + '\')';

          }
          i++;
        }
      },10)
    }  this.cdr.detectChanges();

    this.startTimeOut(this.animation.interval);

  };

  /**
   * Démarre le défilement automatique du carousel
   * @param duration Durée en millisecondes entre chaque défilement
   */
  protected startTimeOut(duration): void
  {
    if (isPlatformBrowser(this.platformId)) {
      this.timeOutID = setTimeout(() => { this.slideRight(); }, duration);
    }
  }

  /** Stoppe le défilement automatique du carousel */
  protected stopTimeOut(): void
  {
    if (isPlatformBrowser(this.platformId)) {
      clearTimeout(this.timeOutID);
    }
  }

  /** Réinitialise le compteur avant défilement du carousel */
  protected resetTimeOut(): void
  {
    this.stopTimeOut();
    this.startTimeOut(this.animation.duration + this.animation.interval);
  }

  /**
   * Désactive les boutons du carousel le temps que la slide défile
   */
  protected disablingInterval(): void
  {
    this.disabled = true;

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(
        () => {
          this.disabled = false;
        },
        this.animation.duration
      );
    }
  }

  /* Fait défiler le carousel vers la slide de gauche */
  public slideLeft() {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.disabled) {
        this.disablingInterval();
        this.resetTimeOut();
        const sliderElement = document.querySelector('.slider') as HTMLElement;
        if (sliderElement) {
          const slideWidth = sliderElement.offsetWidth / this.slides.length;
          const slideDistance = slideWidth * (this.step - 2);
          sliderElement.style.left = '-' + slideDistance + 'px';

          if (this.step <= 1) {
            //this.step = this.slides.length;
            this.disabled = false
            this.jumpToStep(this.slides.length - 1);
          } else {
            this.step--;
          }
        }
      }
    }
  }

  /* Fait défiler le carousel vers la slide de droite */
  public slideRight() {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.disabled) {
        this.disablingInterval();
        this.resetTimeOut();
        const sliderElement = document.querySelector('.slider') as HTMLElement;
        if (sliderElement) {
          const sliderWidth = sliderElement.offsetWidth;
          const slideWidth = sliderWidth / this.slides.length;
          const slideDistance = slideWidth * this.step;

          if (this.step >= this.slides.length) {
            sliderElement.style.left = '0';
            this.step = 1;
          } else {
            sliderElement.style.left = '-' + slideDistance + 'px';
            this.step++;
          }
        }
      }
    }
  }

  /**
   * Ouvre le lien d'une des slides du carousel
   * en fonction du mode de la slide, ouvre le lien dans un nouvel onglet ou sur celui ci
   * @param index L'index de la slide dans le slider
   */
  public openLink(index: number) {
    if (this.images[index].mode === 'BLANK') {
      if (this.images[index].url !== '') {
        this.windowService.open(this.images[index].url);
      }
    } else {
      if (this.images[index].url !== '') {
        if (this.images[index].url.startsWith('/')) {
          this.router.navigateByUrl(this.images[index].url);
        } else {
          this.storageService.clearStorage('carousel');
          this.storageService.getStoredData('carousel', 'link', () => new Observable(obs => {
            obs.next(this.images[index].url);
            obs.complete();
          }));
          this.router.navigate(['actualite']);
        }
      }
    }
  }

  onVisibilityChange(): void {
    if (this.windowService.nativeWindow.document?.hidden) {
      this.stopTimeOut();
    } else {
      this.startTimeOut(this.animation.duration + this.animation.interval);
    }
  }

  /** Fait directement défiler le slider au numero de slide voulu
   * @param targetedStep Position dans le carousel à atteindre, commence à 1 */
  jumpToStep(targetedStep: number): void {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.disabled) {
        this.disablingInterval(); // interval pendant lequel on ne peut plus lancer de slide (changement de slide en cours)
        this.resetTimeOut();

        const sliderElement = document.querySelector('.slider') as HTMLElement;
        if (sliderElement) {
          const slideWidth = sliderElement.offsetWidth / this.slides.length;
          const slideDistance = slideWidth * (targetedStep);
          sliderElement.style.left = '-' + slideDistance + 'px';
        }

        this.step = targetedStep + 1;
      }
    }
  }

  protected readonly faCircle = faCircle;
}
