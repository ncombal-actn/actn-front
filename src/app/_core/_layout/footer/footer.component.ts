import { Component, OnInit } from '@angular/core';
import { CookieService } from '@core/_services';
import { environment } from '@env';
import {faCalendarAlt, faNewspaper} from "@fortawesome/free-solid-svg-icons";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    FaIconComponent
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  environment = environment;
  urlAP: string;
  urRSE: string;

  // urlLogicielAssistance: string = "https://my.splashtop.eu/sos/packages/download/JKAXYXX73YTKEU";
  urlLogicielAssistanceWIN: string = environment.backend+"SupportACTN.exe";
  urlLogicielAssistanceMOS: string = environment.backend+"SupportACTN.dmg";

  constructor(
    public cookieService: CookieService
  ) { }

  ngOnInit() {
    this.urlAP = `${environment.pdfUrl}/apropos_ACTN.pdf`;
    this.urRSE = `${environment.pdfUrl}/Rapport-RSE.pdf`;
  }

  protected readonly faNewspaper = faNewspaper;
  protected readonly faCalendarAlt = faCalendarAlt;
}
