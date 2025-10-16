import {Injectable, Injector} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {environment} from '@env';
import {User} from '@/_util/models';
import {ComponentsInteractionService} from './components-interaction.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {jwtDecode} from 'jwt-decode';
import {CartService} from './cart.service';
import {CotationService} from "@services/cotation.service";
import {LicenceService} from "@services/licence.service";

export type Alive = 'alive' | 'dying' | 'dead';

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  private _licenceService: LicenceService;
  private _cartService: CartService;

  public loginLinkStatus$: Subject<string> = new Subject<string>();

  private _currentUser = new BehaviorSubject<User | null>(null);
  private _alive = new Subject<Alive>();

  constructor(
    private http: HttpClient,
    private componentsInteractionService: ComponentsInteractionService,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private cotationService: CotationService,
    private injector: Injector
  ) {
  }

  private get licenceService(): LicenceService {
    if (!this._licenceService) {
      this._licenceService = this.injector.get(LicenceService);
    }
    return this._licenceService;
  }

  private get cartService(): CartService {
    if (!this._cartService) {
      this._cartService = this.injector.get(CartService);
    }
    return this._cartService;
  }

  public get currentUser$(): Observable<User | null> {
    return this._currentUser.asObservable();
  }

  public get currentUser(): User {
    return this._currentUser.value;
  }

  public get alive$(): Observable<Alive> {
    return this._alive.asObservable();
  }

  private _loginStatus = new BehaviorSubject<boolean>(null);

  public get loginStatus$(): Observable<boolean> {
    return this._loginStatus.asObservable();
  }

  isLoggedIn(): boolean {
    return this.cookieService.check('jwt');
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

  retrieveCurrentSession() {
    const token = this.cookieService.get('jwt');
    if (token) {
      const decoded = jwtDecode(token) as any;
      this._currentUser.next(decoded.data.user as User);
      this.cartService.loadCart();
      this._loginStatus.next(true);
    } else {
      this._loginStatus.next(false);
    }
  }

  login(login: string, password: string): Observable<User> {
    return this.http.post<any>(`${environment.apiUrl}/LogIn.php`, {login, password}, {withCredentials: true})
      .pipe(take(1), map(data => this._login(data)));
  }

  private _login(data): User | any {
    if (data.user.token) {
      this.cookieService.set('jwt', data.user.token, 7, '/');
      const token = this.cookieService.get('jwt');
      const decoded = jwtDecode(token) as any;
      this.cartService.loadCart();
      this._currentUser.next(decoded.data.user as User);
      if (!this.redirect()) {
        this.componentsInteractionService.sideNavigationLine.fireOpenSideNav('toggleEspaceClient');
      }
      this._loginStatus.next(true);

      /** On cherche les cotations et les licenses aux login et les stock dans le session storage pour éviter de les cherchers et évité les erreur */
      this.licenceService.getLicences();
      this.cotationService.getCotations();

      return decoded.data.user as User;
    } else if (data.error) {
      this._loginStatus.next(false);
      return null;
    }
    this._loginStatus.next(false);
    return null;
  }

  linkLogin(id: string, key: string, tag: string, redirection: string = ""): void {
    this.http.get<any>(`${environment.apiUrl}/useLinkConnect.php`, {
      withCredentials: true,
      params: {id, key, tag}
    }).pipe(take(1), map(data => this._login(data)))
      .subscribe(connectionReturn => {
        if (connectionReturn.error) {
          this.loginLinkStatus$.next(connectionReturn.error.message);
        } else {
          this.loginLinkStatus$.next("");
        }
      });
  }

  logout() {
    this._currentUser.next(null);
    this.cookieService.delete('jwt', '/');
    this.http.get<any>(`${environment.apiUrl}/LogOut.php`, {withCredentials: true})
    this._loginStatus.next(false);
    this.cotationService.clearCotations();
    this.licenceService.clearLicences();
    if (this.router.url.includes('espace-client')) {
      this.router.navigate(['/']);
    } else if (this.router.url.includes('panier')) {
      this.router.navigate(['/']);
    }
  }

  redirect(): boolean {
    if (!!this.route.snapshot.queryParamMap.get('returnUrl')) {
      const returnUrl = decodeURI(this.route.snapshot.queryParamMap.get('returnUrl'));
      let returnUrls: string[] = returnUrl.split("?");
      let params: any = {};
      let temp: string[];

      if (returnUrls[1]) {
        returnUrls[1].split("&").forEach(param => {
          if (param) {
            temp = param.split("=");
            params[temp[0]] = temp[1];
          }
        });
      }

      this.router.navigate([returnUrls[0]], {queryParams: params});
      return true;
    }
    return false;
  }

  getNewLoginLinkStatus(): Subject<string> {
    this.loginLinkStatus$ = new Subject<string>();
    return this.loginLinkStatus$;
  }

  hasEscompte(): boolean {
    return this.currentUser && (+this.currentUser.Pescompte > 0);
  }
}
