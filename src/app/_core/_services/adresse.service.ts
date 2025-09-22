import {Injectable} from '@angular/core';
import {environment} from "@env";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map} from "rxjs/operators";
import {BehaviorSubject, Observable} from "rxjs";
import {StorageService} from "@services/storage.service";
import {Adresse} from "@/_util/models";
import {Router} from "@angular/router";
import {RmaService} from "@services/rma.service";
import {AuthenticationService} from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdresseService {
  environment = environment;
  addSuccess = '';
  delSuccess = '';
  defautSuccess = '';
  editSuccess = '';
  private token = "eyJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJqdGkiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJzY29wZXMiOlsidXB0aW1lIiwiYXNzb2NpYXRpb25zIiwib3Blbl9kYXRhIiwiYXR0ZXN0YXRpb25zX2FnZWZpcGgiLCJwcm9idHAiLCJjb3Rpc2F0aW9uc19wcm9idHAiLCJhdHRlc3RhdGlvbnNfZmlzY2FsZXMiLCJhdHRlc3RhdGlvbl9maXNjYWxlX2RnZmlwIiwiYXR0ZXN0YXRpb25zX3NvY2lhbGVzIiwiYXR0ZXN0YXRpb25fc29jaWFsZV91cnNzYWYiLCJiaWxhbnNfZW50cmVwcmlzZV9iZGYiLCJiaWxhbnNfYmRmIiwiZm50cF9jYXJ0ZV9wcm8iLCJjZXJ0aWZpY2F0X2NuZXRwIiwiY2VydGlmaWNhdGlvbl9jbmV0cCIsImNlcnRpZmljYXRfb3BxaWJpIiwicXVhbGliYXQiLCJjZXJ0aWZpY2F0X3JnZV9hZGVtZSIsImRvY3VtZW50c19hc3NvY2lhdGlvbiIsImVudHJlcHJpc2VzIiwidW5pdGVzX2xlZ2FsZXNfZXRhYmxpc3NlbWVudHNfaW5zZWUiLCJldGFibGlzc2VtZW50cyIsImV4ZXJjaWNlcyIsImNoaWZmcmVfYWZmYWlyZXNfZGdmaXAiLCJleHRyYWl0c19yY3MiLCJsaWFzc2VfZmlzY2FsZSIsImxpYXNzZXNfZmlzY2FsZXNfZGdmaXAiLCJjZXJ0aWZpY2F0aW9uc19xdWFsaW9waV9mcmFuY2VfY29tcGV0ZW5jZXMiLCJlb3JpX2RvdWFuZXMiLCJjb252ZW50aW9uc19jb2xsZWN0aXZlcyIsIm1hbmRhdGFpcmVzX3NvY2lhdXhfaW5mb2dyZWZmZSIsImFjdGVzX2lucGkiLCJleHRyYWl0X2NvdXJ0X2lucGkiLCJhc3NvY2lhdGlvbnNfZG9ubmVlc19wcm90ZWdlZXMiLCJhc3NvY2lhdGlvbnNfZGplcHZhIiwibXNhX2NvdGlzYXRpb25zIiwiY290aXNhdGlvbnNfbXNhIiwiY2VydGlmaWNhdGlvbl9vcHFpYmkiLCJlbnRyZXByaXNlc19hcnRpc2FuYWxlcyIsImVmZmVjdGlmc191cnNzYWYiLCJjbmFmX3F1b3RpZW50X2ZhbWlsaWFsIiwiY25hZl9hbGxvY2F0YWlyZXMiLCJjbmFmX2VuZmFudHMiLCJjbmFmX2FkcmVzc2UiLCJjb21wbGVtZW50YWlyZV9zYW50ZV9zb2xpZGFpcmUiLCJjbm91c19zdGF0dXRfYm91cnNpZXIiLCJjbm91c19lY2hlbG9uX2JvdXJzZSIsImNub3VzX2VtYWlsIiwiY25vdXNfcGVyaW9kZV92ZXJzZW1lbnQiLCJjbm91c19zdGF0dXRfYm91cnNlIiwiY25vdXNfdmlsbGVfZXR1ZGVzIiwiY25vdXNfaWRlbnRpdGUiLCJkZ2ZpcF9kZWNsYXJhbnQxX25vbSIsImRnZmlwX2RlY2xhcmFudDFfbm9tX25haXNzYW5jZSIsImRnZmlwX2RlY2xhcmFudDFfcHJlbm9tcyIsImRnZmlwX2RlY2xhcmFudDFfZGF0ZV9uYWlzc2FuY2UiLCJkZ2ZpcF9kZWNsYXJhbnQyX25vbSIsImRnZmlwX2RlY2xhcmFudDJfbm9tX25haXNzYW5jZSIsImRnZmlwX2RlY2xhcmFudDJfcHJlbm9tcyIsImRnZmlwX2RlY2xhcmFudDJfZGF0ZV9uYWlzc2FuY2UiLCJkZ2ZpcF9kYXRlX3JlY291dnJlbWVudCIsImRnZmlwX2RhdGVfZXRhYmxpc3NlbWVudCIsImRnZmlwX2FkcmVzc2VfZmlzY2FsZV90YXhhdGlvbiIsImRnZmlwX2FkcmVzc2VfZmlzY2FsZV9hbm5lZSIsImRnZmlwX25vbWJyZV9wYXJ0cyIsImRnZmlwX25vbWJyZV9wZXJzb25uZXNfYV9jaGFyZ2UiLCJkZ2ZpcF9zaXR1YXRpb25fZmFtaWxpYWxlIiwiZGdmaXBfcmV2ZW51X2JydXRfZ2xvYmFsIiwiZGdmaXBfcmV2ZW51X2ltcG9zYWJsZSIsImRnZmlwX2ltcG90X3JldmVudV9uZXRfYXZhbnRfY29ycmVjdGlvbnMiLCJkZ2ZpcF9tb250YW50X2ltcG90IiwiZGdmaXBfcmV2ZW51X2Zpc2NhbF9yZWZlcmVuY2UiLCJkZ2ZpcF9hbm5lZV9pbXBvdCIsImRnZmlwX2FubmVlX3JldmVudXMiLCJkZ2ZpcF9lcnJldXJfY29ycmVjdGlmIiwiZGdmaXBfc2l0dWF0aW9uX3BhcnRpZWxsZSIsIm1lc3JpX2lkZW50aWZpYW50IiwibWVzcmlfaWRlbnRpdGUiLCJtZXNyaV9pbnNjcmlwdGlvbl9ldHVkaWFudCIsIm1lc3JpX2luc2NyaXB0aW9uX2F1dHJlIiwibWVzcmlfYWRtaXNzaW9uIiwibWVzcmlfZXRhYmxpc3NlbWVudHMiLCJwb2xlX2VtcGxvaV9pZGVudGl0ZSIsInBvbGVfZW1wbG9pX2FkcmVzc2UiLCJwb2xlX2VtcGxvaV9jb250YWN0IiwicG9sZV9lbXBsb2lfaW5zY3JpcHRpb24iLCJwb2xlX2VtcGxvaV9wYWllbWVudHMiLCJtZW5fc3RhdHV0X3Njb2xhcml0ZSIsIm1lbl9zdGF0dXRfYm91cnNpZXIiLCJtZW5fZWNoZWxvbl9ib3Vyc2UiXSwic3ViIjoic3RhZ2luZyBkZXZlbG9wbWVudCIsImlhdCI6MTY5MzkwNTAyNCwidmVyc2lvbiI6IjEuMCIsImV4cCI6MjAwOTUyNDIyNH0.uKkMeXNmzwaultKAuS6l1o9StrZky-mY7XLTzygdut4"

  private _adresses = new BehaviorSubject<Adresse[]>(null);

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private router: Router,
    private rmaService: RmaService,
    private authService: AuthenticationService
  ) {
  }

  public get adressesList(): Adresse[] {
    return this._adresses.value;
  }

  public get adressesList$(): Observable<Adresse[]> {
    return this._adresses.asObservable();
  }

  /**
   * Retourne une liste d'adresse correspondantes à une adresse incomplète.
   * @param search Une adresse incomplète
   * @returns Une liste de 1000 adresses maximum
   * @see https://geo.api.gouv.fr/adresse
   */
  public findAdresse(search: string): Observable<any> {
    return this.httpClient.get<any>('https://api-adresse.data.gouv.fr/search/',
      {
        params: new HttpParams()
          .set('q', search)
          .append('limit', '1000')
      }
    );
  }

  /**
   * Retourne une liste de ville correspondantes aux codes postale.
   * @param cityCode Une code Postal
   * @returns  une liste de ville
   * @see https://api-adresse.data.gouv.fr
   */
  public findCityByCityCode(cityCode: string): Observable<any> {

    return this.httpClient.get<any[]>('https://api-adresse.data.gouv.fr/search/?q=' + cityCode + '&type=municipality&limit=50&autocomplete=1');
  }

  /**
   * Retourne la liste de tous les pays du monde contenant les différentes traductions et le code ISO-3166-1 associés.
   * @returns Un objet sous cette forme {
   *  name: string,
   *  alpha2Code: string,
   *  translations: string[]
   * }
   * @see https://restcountries.eu/
   */
  public getCountries(): Observable<Array<any>> {
    // return this.storageService.getStoredData('pays', 'list', () => {
    return this.httpClient.get<Array<any>>('https://restcountries.com/v2/all',
      {
        params: new HttpParams()
          .set('fields', 'alpha2Code,translations,name')/*;numericCode;*/
      }
    ).pipe(
      map(pays =>
        pays.sort((pays1, pays2) => this.getNameOfCountry(pays1).localeCompare(this.getNameOfCountry(pays2)))
      )
    );
    // });
  }

  /**
   * Retourne le nom d'un pays en français, et si la traduction n'est pas dispo, en anglais.
   * @param pays Un object de la forme {name, translations[fr], ...}
   */
  public getNameOfCountry(pays: { name: string, translations: { fr: string; }; }): string {
    return pays.translations.fr != null ? pays.translations.fr : pays.name;
  }

  /**
   * Retourne le nom d'un pays à partir de son code
   */
  public getCountryFromCode(code = 'fr'): Observable<{ name: string, translations: { fr: string; }; }> {
    if (code.length === 2) {
      return this.storageService.getStoredData('pays', code, () => {
        return this.httpClient.get<{
          name: string,
          translations: { fr: string; };
        }>(`https://restcountries.eu/rest/v2/alpha/${code}`,
          {
            params: new HttpParams()
              .set('fields', 'alpha2Code;translations;name')
          });
      });
    } else {
      return new Observable(obs => {
        obs.next({name: code, translations: {fr: code}});
        obs.complete();
      });
    }
  }

  /*  public getTvaNumer(siren:string){
     const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
     const params = {
       context: "Test api",
       object: "test",
       recipient: '10000001700010'
     }
      this.httpClient
       .get(`https://staging.entreprise.api.gouv.fr/v3/european_commission/unites_legales/${siren}/numero_tva`,{

   }

  */
  getAddress() {
    return this.httpClient
      .get<Adresse[]>(
        `${environment.apiUrl}/ListeAdresses.php`,
        {withCredentials: true, responseType: 'json'}
      );
  }

  editAddressRequest(idAddr, nomAddr, addr1, addr2, codePostal, ville, telephone, pays, defaut) {
    return this.httpClient
      .get(`${environment.apiUrl}/Adresse.php`, {
        withCredentials: true,
        responseType: 'json',
        params: {
          action: 'UPD',
          codead: idAddr,
          nom: nomAddr,
          ad1: addr1,
          ad2: addr2,
          cp: codePostal,
          ville: ville,
          phone: telephone,
          payx: pays,
          defaut: defaut
        }
      });
  }

  addAddressRequest(nomAddr, addr1, addr2, codePostal, ville, telephone, pays, defaut) {
    return this.httpClient
      .get(`${environment.apiUrl}/Adresse.php`, {
        withCredentials: true,
        responseType: 'json',
        params: {
          action: 'ADD',
          codead: '000',
          nom: nomAddr,
          ad1: addr1,
          ad2: addr2,
          cp: codePostal,
          ville: ville,
          phone: telephone,
          payx: pays,
          defaut: defaut
        }
      });
  }

  /**
   * Change the current default address
   */
  changeDefaultAddress(idAddr, nomAddr, addr1, addr2, cp, ville, tel, pays) {
    return this.httpClient
      .get(`${environment.apiUrl}/Adresse.php`, {
        withCredentials: true,
        responseType: 'text',
        params: {
          action: 'UPD',
          codead: idAddr,
          nom: nomAddr,
          ad1: addr1,
          ad2: addr2,
          cp: cp,
          ville: ville,
          phone: tel,
          payx: pays,
          defaut: 'P'
        }
      });
  }

  deleteAddress(idAddr, nomAddr) {
    return this.httpClient
      .get(`${environment.apiUrl}/Adresse.php`, {
        withCredentials: true,
        responseType: 'text',
        params: {
          action: 'DEL',
          codead: idAddr,
          nom: '',
          ad1: '',
          ad2: '',
          cp: '',
          ville: '',
          phone: '',
          payx: '',
          defaut: ''
        }
      });
  }

  displayDefautSuccess(newDefaultName) {
    this.addSuccess = '';
    this.delSuccess = '';
    this.defautSuccess = '';
    this.editSuccess = '';
    this.defautSuccess = newDefaultName;
  }

  displayDelSuccess(deletedName) {
    this.addSuccess = '';
    this.delSuccess = '';
    this.defautSuccess = '';
    this.editSuccess = '';
    this.delSuccess = deletedName;
  }

  checkForm(nomAddr, addr1, addr2, codePostal, ville, telephone, pays) {
    return nomAddr
      && addr1
      && addr2
      && codePostal
      && ville
      && telephone
      && pays
  }

  private adresses(data) {
    this._adresses.next(data as Adresse[])
  }
}
