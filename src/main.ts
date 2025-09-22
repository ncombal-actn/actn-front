import { enableProdMode } from '@angular/core';

import { environment } from '@env';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@/app.component';
import { appConfig } from './app/app.config';

if (environment.production) {
  enableProdMode();
}


  bootstrapApplication(AppComponent , appConfig)
    .catch(err => {});
