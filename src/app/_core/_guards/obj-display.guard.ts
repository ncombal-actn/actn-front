import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '@env';
import { take } from 'rxjs/operators';
import { DematerialisationService } from '@core/_services/dematerialisation.service';

@Injectable({
  providedIn: 'root'
})

export class ObjDisplayGuard  {

  constructor(
    private httpClient: HttpClient,
    private dematService: DematerialisationService,
    ) {
  }

  private statut$ = new Subject<boolean>();

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.verifStatut(state.root.queryParamMap.get('url'));
    return this.statut$.asObservable().pipe(take(1));
  }

  verifFichier(url: string) {
    return this.httpClient.get(url);
  }

  verifStatut(url: string){
    this.verifFichier(url).subscribe(
      data => {  },
      err => {
        if ( err.status === 404 ){
          this.dematService.isPopUp();
        }
        this.statut$.next( err.status !== 404 );
      },
      () => { }
    );
  }
}
