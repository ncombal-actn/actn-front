import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestEliComponent } from './test-eli/test-eli.component';
import { TestARCEPComponent } from './test-arcep/test-arcep.component';

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutilsRoutingModule { }
