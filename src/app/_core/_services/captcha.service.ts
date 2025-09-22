import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';

@Injectable({
  providedIn: 'root'
})
/** Service gérant les requètes relatives au Captcha */
export class CaptchaService {

  constructor(private http: HttpClient) { }

  /**
   * Envoi du token au php pour la comparaison avec la clé secrete.
   * @param token Le token a envoyé
   */
  sendToken(token) {
    return this.http.get<any>(`${environment.apiUrl}/Captcha.php`,
      {
        withCredentials: true, responseType: 'json',
        params: { recaptcha: token }
      });
  }
  

}
