/* import { APP_INITIALIZER, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserStateInterceptor } from '@core/_interceptors/browser-state.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { LoadingInterceptorService } from '@core/_interceptors/loading-interceptor.service';
import { AppResolverService } from '@core/_resolvers/app-resolver.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export function initializeConfiguration(appResolver: AppResolverService) {
  return (): Promise<any> => {
      return appResolver.init();
  };
}

@NgModule({
  imports: [
    AppModule,
    BrowserModule.withServerTransition({ appId: 'actn-website' }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initializeConfiguration, deps: [AppResolverService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: BrowserStateInterceptor, multi: true, },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent],
})
export class AppBrowserModule { }
 */