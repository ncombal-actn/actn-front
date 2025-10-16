import { Routes } from '@angular/router';
import { CdrComponent } from './cdr/cdr.component';

export const MA_CONSOMMATION_ROUTES: Routes = [
  {

    path: 'cdr',
    component: CdrComponent,
    data: {
      filDArianne: [{ url: 'cdr', label: 'cdr', guarded: true }]
    }

  }
];
