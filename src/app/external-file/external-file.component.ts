import { Component, OnInit, SecurityContext, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd , Event} from '@angular/router';
import { Subject, pipe } from 'rxjs';
import { map, filter, takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-external-file',
  templateUrl: './external-file.component.html',
  styleUrls: ['./external-file.component.scss']
})
export class ExternalFileComponent implements OnInit, OnDestroy {

  htmlData: SafeHtml;
  htmlString: any;
  page: string  = '';
  public destroyed = new Subject<void>();

  requestSuccess: boolean = false; //boolean qui passe à true si on récupère une file
  requestedFileExtentions: string[] = ["htm", "php", "html"];

  request

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    const fetchData = () => {
      this.page = decodeURIComponent(this.route.snapshot.paramMap.get('res') );
      const headers = new HttpHeaders({
        'Content-Type': 'text/plain'
      });
      // console.log("page1", this.page);
      if (this.page == "null")
      {
        this.page = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
      }
      // console.log("page2", this.page);
      if (this.page === 'Promotions')
      {
        
        this.request = this.http.get(`${environment.htmlLibre}/${this.page}.html`,
          {
            responseType: 'text'
          })
          .pipe(take(1))
          .subscribe(res => {
            this.htmlString = res;
            this.htmlData = this.sanitizer.bypassSecurityTrustHtml(this.htmlString);
          });
      }
      else if (this.page === 'contacts')
      {
        
        this.request = this.http.get(`${environment.htmlLibre}/${this.page}.htm`,
          {
            responseType: 'text'
          })
          .pipe(take(1))
          .subscribe(res => {
            this.htmlString = res;
            this.htmlData = this.sanitizer.bypassSecurityTrustHtml(this.htmlString);
          });
      }
      else
      {
        let i = 0;
        while (this.requestSuccess == false && i < this.requestedFileExtentions.length)
        {

          this.request = this.http.get(`${environment.pagesHtml}/${this.page}.${this.requestedFileExtentions[i]}`,
            {
              responseType: 'text'
            }
          )
          .pipe(take(1))
          .subscribe(
            (res) =>
            {
              this.htmlString = res;
              this.htmlData = this.sanitizer.bypassSecurityTrustHtml(this.htmlString);
              this.requestSuccess = true;
            },
            (error) =>
            {
              // console.log("nope", error);
              this.requestSuccess = false;
            }
          )

          i++;
        }
      }
    };

    /*this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd),
      takeUntil(this.destroyed)
    ).subscribe(() => {
      fetchData();
    });*/

    this.router.events.pipe(
      filter((event: Event|RouterEvent) => event instanceof NavigationEnd),
      takeUntil(this.destroyed)
    ).subscribe(() => {
      fetchData();
    });

    fetchData();

  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
