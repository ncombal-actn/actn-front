import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet, Routes} from '@angular/router';
import {CommonModule, isPlatformBrowser} from "@angular/common";
import {filter} from "rxjs/operators";
import {AuthenticationService} from '@core/_services';
import {HeartbeatSensorComponent} from '@/heartbeat-sensor/heartbeat-sensor.component';
import {BackToTopComponent} from '@/back-to-top/back-to-top.component';
import {SideNavComponent} from '@core/_layout/side-nav/side-nav.component';
import {RollingHeaderComponent} from '@core/_layout/rolling-header/rolling-header.component';
import {FilDArianneComponent} from '@core/_layout/fil-d-arianne/fil-d-arianne.component';
import {HeaderComponent} from '@core/_layout/header/header.component';
import {SnackbarComponent} from "@/_util/components/snackbar/snackbar.component";
import {SpinnerComponent} from "@/_util/components/spinner/spinner.component";
import {CookiesComponent} from "@/cookies/cookies.component";
import {FooterComponent} from "@core/_layout/footer/footer.component";

declare let gtag: Function;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeartbeatSensorComponent,
    BackToTopComponent,
    SideNavComponent,
    RollingHeaderComponent,
    FilDArianneComponent,
    HeaderComponent,
    SnackbarComponent,
    SpinnerComponent,
    CookiesComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isBrowser: boolean;
  title = 'actn';
  selectedSideNavMenu = '';
  user: boolean = true;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any,
    public auth: AuthenticationService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.auth.retrieveCurrentSession();
  }

  getAllRoutes(routes: Routes): Routes {
    let flattenedRoutes: Routes = [];

    routes.forEach(route => {
      flattenedRoutes.push(route);

      if (route.children) {
        flattenedRoutes = flattenedRoutes.concat(this.getAllRoutes(route.children));
      }
    });

    return flattenedRoutes;
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.setUpAnalytics();
    }
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Scroll en haut du body après chaque navigation
      if (typeof window !== 'undefined') {
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
    });
  }

  show(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  setUpAnalytics() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (typeof gtag === 'function') {
          gtag('config', 'GT-K5MHHR',
            {
              page_path: event.urlAfterRedirects
            }
          );
        }
      });
  }
}
