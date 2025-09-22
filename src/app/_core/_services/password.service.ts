import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';

@Injectable({
	providedIn: 'root',
})
export class PasswordService {

	constructor(private httpClient: HttpClient) { }

	/**
	 * Envoie une demande de nouveau mot de passe.
	 * 
	 * @param mail l'email du client
	 */
	public forgottenPassword(mail: string): Observable<any> {
		return this.httpClient.post(`${environment.apiUrl}/MDPOublie.php`,
			{ mail },
			{ withCredentials: true }
		);
	}

	/**
	 * Change le mot de passe de l'utilisateur courant.
	 * 
	 * @param id identifiant de l'utilisateur courant
	 * @param oldPwd mot de passe actuel de l'utilisateur courant
	 * @param newPwd nouveau mot de passe pour l'utilisateur courant
	 */
	public changePassword(id: string, oldPwd: string, newPwd: string): Observable<any> {
		return this.httpClient.post(`${environment.apiUrl}/PWChange.php`,
			{ id, oldPwd, newPwd },
			{ withCredentials: true }
		);
	}

	/**
	 * Réinitialise le mot de passe d'un utilisateur.
	 * 
	 * @param token Le token généré lors du chiffrement de la demande
	 * @param tokenID Le tag associé à la génération
	 * @param newMdp Le nouveau mot de passe
	 */
	public restaurationPassword(token: string, tokenID: string, newMdp: string): Observable<any> {
		return this.httpClient.post(`${environment.apiUrl}/MDPRestauration.php`,
			{ token, tokenID, newMdp },
			{ withCredentials: true }
		);
	}
}
