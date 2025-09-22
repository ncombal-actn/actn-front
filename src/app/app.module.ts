import {LocationStrategy, PathLocationStrategy, registerLocaleData} from '@angular/common';
import {LOCALE_ID, NgModule} from '@angular/core';
import {LayoutModule} from '@angular/cdk/layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

/* URL SERIALIZER */
import {UrlSerializer} from '@angular/router';
import {CustomUrlSerializer} from './CustomUrlSerializer';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
/* RECAPTCHA */
import {
  RECAPTCHA_SETTINGS,
  RECAPTCHA_V3_SITE_KEY,
  RecaptchaFormsModule,
  RecaptchaModule,
  RecaptchaSettings, RecaptchaV3Module, ReCaptchaV3Service
} from 'ng-recaptcha';

import {AppRoutingModule} from './app-routing.module';

import {UtilModule} from '@/_util/util.module';

/* Root layout */
import {FooterComponent} from '@core/_layout/footer/footer.component';

/* Pages Modules */
import {AccueilComponent} from './accueil/accueil.component';
import {ActualitesComponent} from './actualites/actualites.component';
import {LoginComponent} from './login/login.component';
import {OuvertureDeCompteComponent} from './ouverture-de-compte/ouverture-de-compte.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {RessourcesComponent} from './ressources/ressources.component';
import {CarouselComponent} from './accueil/carousel/carousel.component';
import {VerticalCarouselComponent} from './accueil/vertical-carousel/vertical-carousel.component';
import {
  ConditionsGeneralesDeVenteComponent
} from './conditions-generales-de-vente/conditions-generales-de-vente.component';
import {FavorisComponent} from './favoris/favoris.component';
import {HikAxProComponent} from './ressources/hik-ax-pro/hik-ax-pro.component';

/* Angular svg*/
import {AngularSvgIconModule} from 'angular-svg-icon';

import {ConditionsSavComponent} from './conditions-sav/conditions-sav.component';
import {ObjDisplayComponent} from './obj-display/obj-display.component';
import {DeconnexionComponent} from './deconnexion/deconnexion.component';
import localeFr from '@angular/common/locales/fr';
import {ExternalFileComponent} from './external-file/external-file.component';
import {CharteComponent} from './charte/charte.component';
import {CookiesComponent} from './cookies/cookies.component';
import {CookieService} from 'ngx-cookie-service';
import {FocusComponent} from './focus/focus.component';
import {
  OuvertureDeCompteConfirmationComponent
} from './ouverture-de-compte-confirmation/ouverture-de-compte-confirmation.component';
import {RecrutementComponent} from './recrutement/recrutement.component';
import {ValidationRecrutementComponent} from './recrutement/validation-recrutement/validation-recrutement.component';
import {DocumentManquantComponent} from './document-manquant/document-manquant.component';
import {
  FormulaireProjetVideosurveillanceComponent
} from './formulaire-projet-videosurveillance/formulaire-projet-videosurveillance.component';
import {
  VideosurveillanceConfirmationComponent
} from './formulaire-projet-videosurveillance/videosurveillance-confirmation/videosurveillance-confirmation.component';
import {OutilsComponent} from './outils/outils.component';
import {EchecReglementComponent} from './echec-reglement/echec-reglement.component';
import {ServiceWorkerModule, SwUpdate} from '@angular/service-worker';
import {environment} from "@env";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {NewCartComponent} from "@/new-cart/new-cart.component";
import {ItemWithIconComponent} from "@/new-cart/items";
import {NewAddToCartComponent} from "@/new-cart/new-add-to-cart/new-add-to-cart.component";
import {CartRowComponent} from "@/new-cart/cart-row/cart-row.component";
import {OuvertureDeCompteModule} from "@/ouverture-de-compte/ouverture-de-compte.module";
import { CustomSnackbarComponent } from '@/_util/components/snackbar/custom-snackbar.component';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    FooterComponent,
    AccueilComponent,
    ActualitesComponent,
    LoginComponent,
    /*OuvertureDeCompteComponent,*/
    PageNotFoundComponent,
    RessourcesComponent,
    CarouselComponent,
    ConditionsGeneralesDeVenteComponent,
    ConditionsSavComponent,
    ObjDisplayComponent,
    DeconnexionComponent,
    ExternalFileComponent,
    CharteComponent,
    CookiesComponent,
    FavorisComponent,
    FocusComponent,
    OuvertureDeCompteConfirmationComponent,
    RecrutementComponent,
    ValidationRecrutementComponent,
    DocumentManquantComponent,
    FormulaireProjetVideosurveillanceComponent,
    VideosurveillanceConfirmationComponent,
    OutilsComponent,
    HikAxProComponent,
    VerticalCarouselComponent,
    EchecReglementComponent,
    NewCartComponent,
    NewAddToCartComponent,
    CartRowComponent,
    CustomSnackbarComponent

  ],
  imports: [
    LayoutModule,
    AppRoutingModule,
    UtilModule,
    OuvertureDeCompteModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    AngularSvgIconModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    ItemWithIconComponent,
    /*RecaptchaModule,
    RecaptchaFormsModule*/
    //RecaptchaV3Module
    NgxSkeletonLoaderModule.forRoot(),
  ],

  exports: [
    CookiesComponent,
    FooterComponent,
    NewAddToCartComponent
  ],

  providers: [
    CookieService,
    {provide: LOCALE_ID, useValue: 'fr-FR'},
    {provide: UrlSerializer, useClass: CustomUrlSerializer},
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    SwUpdate,
    /*{
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: '6LcAdb8UAAAAAPXIO-DxkUn8qlWv7QgYWKS20xF9',
    }*/
  ],
 
})
export class AppModule {
}
