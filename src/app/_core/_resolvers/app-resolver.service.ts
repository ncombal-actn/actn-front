import { Injectable } from '@angular/core';
import { AuthenticationService } from '@core/_services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AppResolverService {

    constructor(private authService: AuthenticationService) { }

    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            /*this.authService.retrieveCurrentSession().subscribe(() => {
               // this.authService.keepAlive();

                resolve();
            });*/
        });
    }
}
