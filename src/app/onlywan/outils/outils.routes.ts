import {TestEligibiliteComponent} from "../test-eligibilite/test-eligibilite.component";
import {Routes} from "@angular/router";

export const OUTILS_ROUTES: Routes = [
  {
    path: 'testDEligibilite',
    component: TestEligibiliteComponent,
    data: {
      filDArianne: [{ url: 'testDEligibilite', label: 'test éligibilité' }]
    }
  }
];
