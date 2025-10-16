import { Routes } from '@angular/router';
import { TestEliComponent } from './test-eli/test-eli.component';

export const OUTILS_ROUTES: Routes = [
  {
    path: 'testDEligibilite',
    component: TestEliComponent,
    data: {
      filDArianne: [{ url: 'testDEligibilite', label: 'test éligibilité' }]
    }
  }/* ,
    {
    path: 'testARCEP',
    component: TestARCEPComponent,
    data: {
      filDArianne: [{ url: 'testARCEP', label: 'test ARCEP' }]
    }
  } */
];
