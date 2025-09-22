import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Commande} from '@/_util/models';
import {environment} from '@env';
import {Observable} from 'rxjs';
import {AuthenticationService} from "@services/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class CommandesService {
  constructor(private httpClient: HttpClient, private authService: AuthenticationService) {
  }

  /**
   * Renvoie les en-têtes de toutes les commandes passées par le client.
   */
  getCommandes(): Observable<Array<Commande>> {
    return this.httpClient.get<Commande[]>(`${environment.apiUrl}/CommandesEntete.php`,
      {
        withCredentials: true
      });
  }
}
