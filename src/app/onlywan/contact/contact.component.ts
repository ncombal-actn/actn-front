import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from '@env';
import { take } from 'rxjs/operators';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {TitleWLineComponent} from "@/_util/components/title-w-line/title-w-line.component";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    TitleWLineComponent,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  test = {
    'border-color': '#7ec67f !important',
    'color': '#7ec67f !important'

  }
  contactsHTML: SafeHtml = null;
  constructor( private http: HttpClient,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.contactsHTML = this.getContact('onlywan/contact.html');
  }
  getContact(url: string): any {

    this.http.get(`${environment.backend}`+ url,
      {
        withCredentials: true,
        responseType: 'text'
      })
      .pipe(take(1))
      .subscribe(
        (res) => {
          const htmlString = res;
          this.contactsHTML = this.sanitizer.bypassSecurityTrustHtml(htmlString);
        }

      );
  }

}
