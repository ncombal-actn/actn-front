import { AfterViewInit, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
//import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { tap, map, take, takeUntil } from 'rxjs/operators';
import { environment } from '@env';
import { StorageService, WindowService, AuthenticationService } from '@core/_services';
import { Router } from '@angular/router';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { CarouselData } from '@core/_services/carousel.service';
import {faCircle} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-vertical-carousel',
  templateUrl: './vertical-carousel.component.html',
  styleUrls: ['./vertical-carousel.component.scss']
})
export class VerticalCarouselComponent implements OnInit, OnDestroy, AfterViewInit
{
    @Input() carouselData$: BehaviorSubject<CarouselData>;
    carouselData: CarouselData = null;

    firstLoad: boolean = false;
    // parametres de l'animation du carousel
    animation: {duration: number, interval: number} = {
        duration: 500,
        interval: 5000,
    };

    /** URL du dossier de l'environment où trouver les images du carousel */
    url: string;
    /** Tableau des URLs absolues et completes des images du carousel */
    slides: Array<string> = [];
    /** Position actuelle du carousel dans la liste de slides (compris entre 1 et slides.length) */
    step: number = 1;
    /** L'ID actuel du timeOut qui fait défiler periodiquement le carousel */
    timeOutID = null;
    /** Bool true quand les boutons du carousel sont désactivés */
    disabled: boolean = false;
    /** Tableau d'informations des slides */
    images: CarouselData["slides"];
    /** Bool true quand la souris de l'utilisateur est au dessus du carousel */
    isHovering: boolean = false;

    /** Observable de nettoyage, déclanchée à la destruction du composant */
    private _destroy$ = new Subject<void>(); //

    constructor(
        private storageService: StorageService,
        private authenticationService: AuthenticationService,
        private router: Router,
        private http: HttpClient,
        private window: WindowService,
        private cdr: ChangeDetectorRef,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.url = environment.carouselUrl;
    }

    ngOnInit(): void
    {


        // on halte l'animation du carousel si on quite la page
        window.onfocus = () =>
        {
            /*var d = new Date;
*/
            this.startTimeOut(this.animation.interval);
        };
        window.onblur = () =>
        {
            /*var d = new Date;
*/
            this.stopTimeOut();
        };

    }
    /** Destruction du CarouselComponent */
    ngOnDestroy(): void
    {
        this.stopTimeOut();
        this._destroy$.next();
        this._destroy$.complete();
    }
    ngAfterViewInit(): void {
        this.carouselData$ // init carousel and reload when user changes
        .pipe(takeUntil(this._destroy$))
        .subscribe(
            (newCarouselData) =>
            {
                this.carouselData = newCarouselData;
                this.initCarousel();
            }
        );
    }

    /** Initialise les slides du carousel */
    initCarousel(): void
    {
        this.slides = [];
        this.images = this.carouselData.slides;
        this.step = 1;
        this.stopTimeOut();
        for (let i = 0; i <= (this.images.length - 1); i++) {
            this.slides.push(this.url + this.images[i].image);
        }
        this.setSlider();
    }

    /** Paramètre le CSS du carousel pour chaque slides */
    setSlider(): void {
        if (isPlatformBrowser(this.platformId)) {


            // SLIDER SETTINGS
            const sliderElement = document.querySelector('.slider') as HTMLElement;
            if (sliderElement) {
              sliderElement.style.height = this.slides.length + '00%';
            }

            // RESET SLIDER ANIMATION
            const sliderContainer = document.querySelector('.slider') as HTMLElement;
            if (sliderContainer) {
              sliderContainer.style.top = '0';
            }

            // SLIDES SETTINGS
            let i = 0;
            setTimeout(() => {
            while (i < this.slides.length) {
              const slideElement = document.querySelector('#carouselSlide' + (i + 1)) as HTMLElement;
              if (slideElement) {
                slideElement.style.backgroundImage = 'url(\'' + this.slides[i] + '\')';
              }
              i++;
            }
        },10)
        }
        this.cdr.detectChanges();
        // Start the automatic sliding
        this.startTimeOut(this.animation.interval);
        // -----//
      }


    /**
     * Démarre le défilement automatique du carousel
     * @param duration Durée en millisecondes entre chaque défilement
     */
    startTimeOut(duration): void
    {
        if (isPlatformBrowser(this.platformId)) {
            this.timeOutID = setTimeout(() => { this.slideDown(); }, duration);
        }
    }
    /** Stoppe le défilement automatique du carousel */
    stopTimeOut(): void
    {
        if (isPlatformBrowser(this.platformId)) {
            clearTimeout(this.timeOutID);
        }
    }

    /** Réinitialise le compteur avant défilement du carousel */
    resetTimeOut(): void
    {
        this.stopTimeOut();
        this.startTimeOut(this.animation.duration + this.animation.interval);
    }

    /**
     * Désactive les boutons du carousel le temps que la slide défile
     */
    disablingInterval(): void
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

    /* Fait défiler le carousel vers la slide du haut */
    slideUp(): void {
        if (isPlatformBrowser(this.platformId)) {
          if (!this.disabled) {
            this.disablingInterval(); // interval pendant lequel on ne peut plus lancer de slide (changement de slide en cours)
            this.resetTimeOut();

            const sliderElement = document.querySelector('.slider') as HTMLElement;
            if (sliderElement) {
              const slideHeight = sliderElement.offsetHeight / this.slides.length;
              const slideDistance = slideHeight * (this.step - 2);
              sliderElement.style.top = '-' + slideDistance + 'px';
            }

            if (this.step <= 1) {
              //this.step = this.slides.length;
              this.disabled = false;
              this.jumpToStep(this.slides.length - 1);
            } else {
              this.step--;
            }
          }
        }
      }


    /* Fait défiler le carousel vers la slide du bas */
    slideDown(): void {
        if (isPlatformBrowser(this.platformId)) {
          if (!this.disabled) {
            this.disablingInterval();
            this.resetTimeOut();

            const sliderElement = document.querySelector('.slider') as HTMLElement;
            if (sliderElement) {
              const slideHeight = sliderElement.offsetHeight / this.slides.length;
              const slideDistance = slideHeight * this.step;
              sliderElement.style.top = '-' + slideDistance + 'px';
            }

            if (this.step >= this.slides.length) {
              this.step = 1;
            } else {
              this.step++;
            }
          }
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
              const slideHeight = sliderElement.offsetHeight / this.slides.length;
              const slideDistance = slideHeight * (targetedStep - 1);
              sliderElement.style.top = '-' + slideDistance + 'px';
            }

            this.step = targetedStep + 1;
          }
        }
      }


    /**
     * Ouvre le lien d'une des slides du carousel
     * en fonction du mode de la slide, ouvre le lien dans un nouvel onglet ou sur celui ci
     * @param index L'index de la slide dans le slider
     */
    openLink(index: number)
    {
        if (this.images[index].mode === 'BLANK') { // IF BLANK MODE
            if (this.images[index].url !== '') {
                this.window.open(this.images[index].url);
            }
        } else {
            if (this.images[index].url !== '') { // s'il y a bien un lien
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

    onVisibilityChange(): void
    {
        if (this.window.document?.hidden) {
            this.stopTimeOut();
        } else {
            this.startTimeOut(this.animation.duration + this.animation.interval);
        }
    }

  protected readonly faCircle = faCircle;
}
