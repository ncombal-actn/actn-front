import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from '@env';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {

  environment= environment
  accueilHTML: SafeHtml = null;
  constructor(public http: HttpClient, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
 //   this.accueilHTML = this.getHTML('onlywan/accueil.html');
  }
  getHTML(url: string): any {

    this.http.get(`${environment.backend}`+ url,
      {
        withCredentials: true,
        responseType: 'text'
      })
      .pipe(take(1))
      .subscribe(
        (res) => {
          const htmlString = res;
          this.accueilHTML = this.sanitizer.bypassSecurityTrustHtml(htmlString);
        }
      );
  }

}
