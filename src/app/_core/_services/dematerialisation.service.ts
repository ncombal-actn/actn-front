import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '@env';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DematerialisationService {

  // création d'un evenement pour régler le problème de l'opacité lors de la pop up de la page commande
  popUpObjDisplay = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
  ) { }

  submitNewContact(email: string, nomUs: string, telephone: string): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrl}/IDutilisateur.php`,
        {
          withCredentials: true,
          params: {
            action: 'ADD',
            service: 'FAC',
            mail: email,
            nom: nomUs,
            tel: telephone,
            droit: 'N',
            mailling: 'N',
            pass: '',
            id: '',
            numindividu: '',
          }
        });
  }

  // emission de l'evenement pour regler le problème d'opacité lors du pop up
  isPopUp(): void {
    this.popUpObjDisplay.emit('Ok');
  }
}
