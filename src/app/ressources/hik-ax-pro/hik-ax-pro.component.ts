import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { /*Cart, CartItem,*/ Produit/*, Client, Cotation*/ } from '@/_util/models';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Subject, pipe, Observable } from 'rxjs';
import { map, filter, takeUntil, take } from 'rxjs/operators';
import { environment } from '@env';
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import {WindowService} from "@core/_services";

class HikaxproCategory {
  titre: string;
  url: string;
}

@Component({
	selector: 'app-hik-ax-pro',
	templateUrl: './hik-ax-pro.component.html',
	styleUrls: ['./hik-ax-pro.component.scss']
})
export class HikAxProComponent implements OnInit
{
	axProHeaderHtml: SafeHtml = null;
	refsOfDefaultProducts: Array<{actnRef: string, hikRef: string}> = null;
	defaultProducts: Produit[] = null;
	defaultProductsLength: number = 0;
	bannerImgUrl: string = "assets/img/hik-ax-pro-header.webp"; // url relative de l'image de la banière en debut de page
	modelImgUrl: string = "assets/img/interactive-image.webp"; // url relative de l'image du modèle interactif

	plusdinfo: boolean = false;

	catalogueLinkIndex = "defaut";
	catalogueLinkList: { repeteur: HikaxproCategory, aimantchoc: HikaxproCategory, badge: HikaxproCategory, boutonurgence: HikaxproCategory, brisdeglace: HikaxproCategory, camera: HikaxproCategory, clavier: HikaxproCategory, centraleaxpro: HikaxproCategory, eau: HikaxproCategory, fumee: HikaxproCategory, hikconnect: HikaxproCategory, pircam: HikaxproCategory, relais: HikaxproCategory }
	= {
		repeteur:
			{
				titre: "Répétiteur sans fil",
				url: "/catalogue/S%C3%A9curit%C3%A9/Alarme%20intrusion/R%C3%A9p%C3%A9teur?&Centrale%20compatible=AXPRO&Marque=HIKVISION", // repeteur
			},
		aimantchoc:
			{
				titre: "Aimant + Capteur de choc",
				url: "/catalogue/S%C3%A9curit%C3%A9/Alarme%20intrusion/D%C3%A9tecteur/314300097?Marque=HIKVISION", //aimant + choc
			},
		badge:
			{
				titre: "Badges & lecteurs",
				url: "/catalogue/search?search=AXPRO%20badge&Sous-Famille=TEB&Sous-Famille=LHI&Sous-Famille=CLA&Marque=HIKVISION", // badge
			},
		boutonurgence:
			{
				titre: "Bouton d'urgence",
				url: "/catalogue/S%C3%A9curit%C3%A9/Alarme%20intrusion/Bouton%20panique?&Centrale%20compatible=AXPRO&Marque=HIKVISION", // bouton urgence
			},
		brisdeglace:
			{
				titre: "Détecteur de bris de glace",
				url: "/catalogue/search?search=bris%20de%20glace&Marque=HIKVISION", // bris de glace
			},
		camera:
			{
				titre: "Caméra IP",
				url: "/catalogue/Vid%C3%A9o/Cam%C3%A9ras%20IP/unique?&Marque=HIKVISION", //camera
			},
		clavier:
			{
				titre: "Clavier",
				url: "/catalogue/S%C3%A9curit%C3%A9/Alarme%20intrusion/Clavier%20Lect%20%20Badge?&Centrale%20compatible=AXPRO&Marque=HIKVISION", // clavier
			},
		centraleaxpro:
			{
				titre: "Centrale AX PRO",
				url: "/catalogue/S%C3%A9curit%C3%A9/Alarme intrusion/Pack Alarme?&Centrale%20compatible=AXPRO&Marque=HIKVISION", // defaut
			},
		eau:
			{
				titre: "Détecteur de fuite d’eau",
				url: "/catalogue/S%C3%A9curit%C3%A9/Alarme%20intrusion/D%C3%A9tecteur%20fuite%20eau/314300106?Marque=HIKVISION", // eau
			},
		/* x */fumee:
			{
				titre: "Détecteur de fumée",
				url: "/catalogue/S%C3%A9curit%C3%A9/Alarme%20intrusion/D%C3%A9tecteur%20fum%C3%A9e/314300075?Marque=HIKVISION", // fumée
			},
		hikconnect:
			{
				titre: "Hik-Connect",
				url: "http://www.hikvision.com/fr/products/software/hik-connect/", // hik connect
			},
		pircam:
			{
				titre: "PIRCAM",
				url: "/catalogue/search?search=PIR%20CAM&Famille=ALA&Marque=HIKVISION", // pircam
			},
		relais:
			{
				titre: "Relais",
				url: "/catalogue/S%C3%A9curit%C3%A9/Alarme%20intrusion/Acc%20sans%20fil?&Centrale%20compatible=AXPRO&Marque=HIKVISION" // relais
			}
	};

	/**
	 * Tableau réunissant les clefs des liens de catalogue
	 * généré à l'initialisation du component à partir de 'catalogueLinkList'
	 * les 'slidingListComponents' sont générés et sont accéssibles à partir de cette liste
	 */
	catalogueLinksListOfKeys: Array<string> = [];

	constructor(
		private router: Router,
		private http: HttpClient,
		private sanitizer: DomSanitizer,
    private windowService: WindowService
	) { }

	ngOnInit(): void
	{
		this.catalogueLinksListOfKeys = Object.keys(this.catalogueLinkList);

		this.getAxProHeaderHtml();
		this.getDefaultProductsRefs();

		/*var arg: Array<{actnRef: string, hikRef: string}> = [
			{actnRef: "314300256", hikRef: ""},
			{actnRef: "314300270", hikRef: ""},
			{actnRef: "302401658", hikRef: ""}
		];
		this.getDefaultProducts(arg);*/
	}

  changeSlidingListUrl(newIndexOfLink: string): void {
    this.catalogueLinkIndex = newIndexOfLink;
    this.windowService.scrollToElement('#catalogueTitre', 45, 115);
  }

	capitalizeFirstLetter(str: string): string {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	navigateAxProLink(url: string) {
		this.router.navigateByUrl(url);
	}


	getAxProHeaderHtml(): void
	{
		this.http.get(`${environment.htmlLibre}/hikaxpro-txt.htm`,
			{
				responseType: 'text'
			})
			.pipe(take(1))
			.subscribe(
				(ret) => {
					const htmlString = ret;
					this.axProHeaderHtml = this.sanitizer.bypassSecurityTrustHtml(htmlString);
				}
			);
	}

	getDefaultProductsRefs(): void
	{
		this.http.get(`${environment.htmlLibre}/hikaxpro-defautl-references.json`,
			{
				responseType: 'json'
			})
			.pipe(take(1))
			.subscribe(
				(ret) => {
					this.refsOfDefaultProducts = ret as Array<{actnRef: string, hikRef: string}>;

					this.getDefaultProducts(this.refsOfDefaultProducts);
				}

			);
	}
	getDefaultProducts(refs: Array<{actnRef: string, hikRef: string}>): void
	{
		const refsActn: string[] = [];

		for (const ref of refs)
		{
			refsActn.push(ref.actnRef);
		}

		this.http.post<Array<Produit>>(`${environment.apiUrl}/ProduitMultById.php`,
			{
				ref: refsActn
			},
			{
				responseType: 'json',
				withCredentials: true,
			})
			.pipe(take(1))
			.subscribe(
				(ret) => {

					this.defaultProductsLength = ret.length;
					this.defaultProducts = ret;
				}

			);
	}

	moreInfo(): void
	{
		this.plusdinfo = true;
	}

  protected readonly faCircle = faCircle;
}
