import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet, Routes} from '@angular/router';
import {isPlatformBrowser} from "@angular/common";
import {filter} from "rxjs/operators";
import {UtilModule} from "@/_util/util.module";
import {AppModule} from "@/app.module";
import { AuthenticationService } from '@core/_services';
import { HeartbeatSensorComponent } from '@/heartbeat-sensor/heartbeat-sensor.component';
import { BackToTopComponent} from '@/back-to-top/back-to-top.component';
import { SideNavComponent } from '@core/_layout/side-nav/side-nav.component';
import { RollingHeaderComponent } from '@core/_layout/rolling-header/rolling-header.component';
import { FilDArianneComponent } from '@core/_layout/fil-d-arianne/fil-d-arianne.component';
import { HeaderComponent } from '@core/_layout/header/header.component';
declare let gtag: Function;

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, UtilModule, AppModule, HeartbeatSensorComponent,BackToTopComponent,SideNavComponent,RollingHeaderComponent,FilDArianneComponent,HeaderComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isBrowser:boolean;
  title = 'actn';
  selectedSideNavMenu = '';
  user: boolean = true;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any,
    public auth: AuthenticationService,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
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
      window.scrollTo({ top: 0, behavior: 'smooth' }); // ou behavior: 'auto'
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
