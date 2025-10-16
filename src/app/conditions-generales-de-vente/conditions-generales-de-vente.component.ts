import { Component, OnInit } from '@angular/core';
import { WindowService } from '@core/_services';
import { CatalogueService } from '@core/_services/catalogue.service';
import {TitleWLineComponent} from "@/_util/components/title-w-line/title-w-line.component";

@Component({
  selector: 'app-conditions-generales-de-vente',
  standalone: true,
  imports: [
    TitleWLineComponent
  ],
  templateUrl: './conditions-generales-de-vente.component.html',
  styleUrls: ['./conditions-generales-de-vente.component.scss']
})
export class ConditionsGeneralesDeVenteComponent implements OnInit {

  constructor(
    private catalogueSerive: CatalogueService,
    private windowService: WindowService
  ) { }

  ngOnInit() {
    this.catalogueSerive.setFilArianne(false);
  }

  ngOnDestroy() {
    this.catalogueSerive.setFilArianne(true);
  }

  historyBack() {
    this.windowService.nativeWindow.history.back();
  }

}
