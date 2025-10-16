import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withHttpTransferCacheOptions} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi} from "@angular/common/http";
import {LoadingInterceptorService} from "@core/_interceptors/loading-interceptor.service";
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {provideAnimations} from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideClientHydration(withHttpTransferCacheOptions({includePostRequests: true})),
    provideAnimations(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorService, multi: true},
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'}

  ]
};
