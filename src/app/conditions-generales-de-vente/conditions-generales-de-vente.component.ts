import { Component, OnInit } from '@angular/core';
import { WindowService } from '@core/_services';
import { CatalogueService } from '@core/_services/catalogue.service';

@Component({
  selector: 'app-conditions-generales-de-vente',
  templateUrl: './conditions-generales-de-vente.component.html',
  styleUrls: ['./conditions-generales-de-vente.component.scss']
})
export class ConditionsGeneralesDeVenteComponent implements OnInit {

  constructor(
    private catalogueSerive: CatalogueService,
    private window: WindowService
  ) { }

  ngOnInit() {
    this.catalogueSerive.setFilArianne(false);
  }

  ngOnDestroy() {
    this.catalogueSerive.setFilArianne(true);
  }

  historyBack() {
    this.window.history.back();
  }

}
