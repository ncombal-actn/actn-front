import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService, Alive } from '@core/_services';
import { filter, switchMap, takeUntil, takeWhile } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject, Subscription, timer } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

@Component({
    selector: 'app-heartbeat-sensor',
    templateUrl: './heartbeat-sensor.component.html',
    standalone: true,
    imports:[CommonModule],
    styleUrls: ['./heartbeat-sensor.component.scss']
})
export class HeartbeatSensorComponent implements OnInit, OnDestroy {

  /** Bool Définissant si l'on affiche le popup Heartbeat */
  showPopUp = new BehaviorSubject<boolean>(false);
  /**
   * Status de la session
   * @example
   * 'alive' || 'dying' || 'dead'
   */
  state: Alive = 'alive';

  /** Observable de nettoyage, déclanchée à la destruction du HeartbeatSensorComponent */
  private _destroy$ = new Subject<void>();

  timerObservable
  subscription: Subscription;
  constructor(
      public auth: AuthenticationService,
      private router: Router,
      private location: Location,

  ) { }

  /** Initialisation du HeartbeatSensorComponent */
  ngOnInit(): void {
    /*this.auth.warn$.subscribe((data) => {

      if(data == 'dying'){
        //this.deconnexion();
        this.showPopUp.next(true);
      }
      if (data == 'dead'){
        this.deconnexion()
      }

    });*/


  }

  /** Destruction du HeartbeatSensorComponent */
  ngOnDestroy(): void {
      this._destroy$.next();
      this._destroy$.complete();
  }

  deconnexion(){
    this.router.navigate(['/']);
    this.showPopUp.next(false) ;
  }

  onReconnect(): void {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.location.path() } });
    this.showPopUp.next(false);
  }

  stayAlive(){
    /*this.auth.idleWarn.next('alive');
    this.auth.isIdleOrNot();*/
    this.showPopUp.next(false);
  }

}
