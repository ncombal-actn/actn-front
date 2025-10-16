import {enableProdMode} from '@angular/core';

import {environment} from '@env';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from '@/app.component';
import {appConfig} from '@/app.config';
import {registerLocaleData} from "@angular/common";
import localeFr from '@angular/common/locales/fr';

if (environment.production) {
  enableProdMode();
}

registerLocaleData(localeFr);

bootstrapApplication(AppComponent, appConfig)
  .catch(err => {
  });
