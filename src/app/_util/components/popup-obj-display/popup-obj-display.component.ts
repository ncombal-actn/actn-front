import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService, Alive } from '@core/_services';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DematerialisationService } from '@core/_services/dematerialisation.service';

@Component({
  selector: 'app-popup-obj-display',
  templateUrl: './popup-obj-display.component.html',
  styleUrls: ['./popup-obj-display.component.scss']
})
export class PopupObjDisplayComponent implements OnInit, OnDestroy {

  showPopup = false;
  temp: Subscription;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private location: Location,
    private dematService: DematerialisationService,
  ) {
    this.temp = this.dematService.popUpObjDisplay.subscribe(
      (data: any) => {
        if (data === 'Ok') {
          this.showPopup = true;
        } else {
          this.showPopup = false;
        }
      },
      error => { },
      () => { }
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.temp.unsubscribe();
  }

  /*
  * Cache la popup de déconnexion.
  */
  hide(): void {
    this.showPopup = false;
  }

}
