import {Component, OnInit} from '@angular/core';
import {UserService} from '@core/_services';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {take} from 'rxjs/operators';
import {environment} from '@env';
import {faUserTie} from "@fortawesome/free-solid-svg-icons";

@Component({
	selector: 'app-contacts',
	templateUrl: './contacts.component.html',
	styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit{

	contactadmHtmlData: SafeHtml = '' as SafeHtml;

	constructor(
		public userService: UserService,
		private http: HttpClient,
		private sanitizer: DomSanitizer
	) { }

	ngOnInit()
	{
		//Remplacer par contact.htm quand les save sur le nass seront ok
		this.http.get(`${environment.htmlLibre}/contactsSave.htm`,
			{
				responseType: 'text'
			})
			.pipe(take(1))
			.subscribe(
				(res) => {
          this.contactadmHtmlData = this.sanitizer.bypassSecurityTrustHtml(res);
				}
			);
	}

  protected readonly faUserTie = faUserTie;
}
