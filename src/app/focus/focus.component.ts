import { Component, OnInit } from '@angular/core';
import { environment } from '@env';
// constructor
import { HttpClient } from '@angular/common/http';

import { DomSanitizer } from '@angular/platform-browser';

import { take } from 'rxjs/operators';
import {NgClass} from "@angular/common";
import {SlidingListFromLinkComponent} from "@/_util/components/sliding-list-from-link/sliding-list-from-link.component";

@Component({
  selector: 'app-focus',
  standalone: true,
  templateUrl: './focus.component.html',
  imports: [
    NgClass,
    SlidingListFromLinkComponent
  ],
  styleUrls: ['./focus.component.scss']
})
export class FocusComponent implements OnInit {

	environment = environment;

	focusTarget :string = "";

	focusedList :number = 0;

	htmlString;
	htmlData;

	// nom du fichier .htm dans le dossier 'environment.focusPath + focusTarget'
	htmFile: string = "";
	// nom de la banière .webp dans le dossier 'environment.focusPath + focusTarget'
	baniere: string = "";
	// nom des images .webp à afficher, dans le dossier 'environment.focusPath + focusTarget'
	imageList: Array<any>;
	// urls du catalogue que les images affichent
	catalogueLinkList: Array<any>;
	// array that keep track of and trigger the loading of 'SlidingListFromLink's components
	loadSlidingListFromLinkArray: boolean[] = [];

	constructor(
        private http: HttpClient,
        private sanitizer: DomSanitizer
	) { }

	ngOnInit(): void
	{
		// get focus component's targeted folder
		this.focusTarget = window.location.href.split('/').pop();
		this.focusTarget = this.focusTarget.split("?")[0];

		this.http
			.get<any>(`${environment.apiUrl}/FocusScanDirectory.php`,
				{
					withCredentials: true,
					responseType: 'json',
					params: {
						focus: this.focusTarget
					}
				}
			)
			.pipe(take(1))
			.subscribe(
				(data) => {
					this.htmFile = data.htm;
					this.baniere = data.webp;
					this.imageList = data.imgs;
					this.catalogueLinkList = data.urls;
					this.loadSlidingListFromLinkArray.fill(false, 0, (this.catalogueLinkList.length - 1) );
					this.loadSlidingListFromLinkArray[0] = true;


					// requete récupérant le HTML
					const request = this.http
					.get(environment.focusPath + this.focusTarget + "/" + this.htmFile,
						{
							withCredentials: true,
							responseType: 'text'
						}
					)
					.pipe(take(1))
					.subscribe((res) =>
						{
							// this.sanitizer.bypassSecurityTrustHtml(res);
							this.htmlString = res;
							this.htmlData = this.sanitizer.bypassSecurityTrustHtml(this.htmlString); // this line bypasses angular security
						});
				},
				(error) => {
				}
			);




	}

	focusOn(target :number): void
	{
		this.loadSlidingListFromLinkArray[target] = true;
		this.focusedList = target;
	}

}
