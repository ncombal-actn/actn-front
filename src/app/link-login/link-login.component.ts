import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
// RXJS
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '@/_core/_services';

@Component({
  selector: 'app-link-login',
  standalone: true,
  templateUrl: './link-login.component.html',
  imports: [
    RouterLink
  ],
  styleUrls: ['./link-login.component.scss']
})
export class LinkLoginComponent implements OnInit, OnDestroy
{
  // Request parameters
  private id: string;
  private key: string;
  private tag: string;
  // status parameters
  public loading: boolean = true;
  public error: string = "";
  public success: string = "";

  private defaultRedirection = "accueil"; // position de la redirection si aucune returnUrl n'est lue dans les paramètres de la route

  private _destroy$ = new Subject<void>();

  constructor(
    private httpClient: HttpClient,
    public authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void
  {

    this.route.queryParams
    .pipe(take(1))
    .subscribe(
      (routeParams) =>
      {
        if (!routeParams.id || !routeParams.key || !routeParams.tag)
        {
          this.error = "Paramètres de route invalides.";
          return null;
        }

        // get params
        this.id = routeParams.id;
        this.key = routeParams.key;
        this.tag = routeParams.tag;

        // prépare à recevoir le status de l'opération depuis l'authentication.service
        this.authService.getNewLoginLinkStatus()
        .pipe(takeUntil(this._destroy$))
        .subscribe(
          (loginStatus: string) =>
          {
            if (loginStatus)
            {
              this.error = loginStatus;
            }
            else
            {
              this.success = "Connection réussie, redirection...";
              if (!routeParams.returnUrl)
              {
                this.router.navigate([this.defaultRedirection]);
              }
            }
            this.loading = false;
          },
          (error) =>
          {
            this.error = "Echec de la connexion.";
            this.loading = false;
          }
        );

        // try to connect with params
        this.authService.linkLogin(this.id, this.key, this.tag);
      },
      (queryParamsError) =>
      {
        this.error = "Erreur dans les paramètres de route.";
        this.loading = false;
        console.error("link-login.component > erreur dans les paramètres de route : ", queryParamsError);
      }
    );
  }

  ngOnDestroy(): void
  {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
