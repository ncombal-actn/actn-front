import {  Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Produit } from "@/_util/models";
import { ProduitWithDescription } from "@/catalogue/produit/produit-resolver.service";
import { take } from "rxjs/operators";
import { environment } from "@env";
import { Observable, forkJoin } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ProduitDetailService {
  constructor(private route: ActivatedRoute, private router: Router,private http: HttpClient) {}

 /*  getProduit(
    callback: (
      produit: Produit,
      imgUrl: string,
      descriptionMap: Map<string, Array<string>>,
      produitsRemplacement: Array<Produit>,
      produitsSimilaires: Array<Produit>,
      produitsAssocies: Array<Produit>
    ) => void
  ): void {
    this.route.data.subscribe((data: { produit: ProduitWithDescription }) => {
      const produit = data.produit.produit$;
      const description = data.produit.description$;
      const produitsRemplacement = data.produit.produitsRemplacement$;
      const produitsSimilaires = data.produit.produitsSimilaires$;
      const produitsAssocies = data.produit.produitsAssocies$;

      produit.pipe(take(1)).subscribe((produitData) => {
        const imgUrl =
          environment.photosUrl + this._urlImage(produitData.photo);
        description.pipe(take(1)).subscribe((descriptionData) => {


          const descriptionMap = new Map<string, Array<string>>();

          descriptionData.forEach((desc) => {
            if (desc.description.length > 0) {
              // Vérifie si le type existe déjà dans la map
              if (!descriptionMap.has(desc.type)) {
                // Si non, initialise avec un tableau vide
                descriptionMap.set(desc.type, []);
              }
              // Ajoute la description au tableau correspondant au type
              descriptionMap.get(desc.type).push(desc.description.trim());
            }
          });


          produitsRemplacement
            .pipe(take(1))
            .subscribe((produitsRemplacementData) => {
              produitsSimilaires
                .pipe(take(1))
                .subscribe((produitsSimilairesData) => {
                  produitsAssocies
                    .pipe(take(1))
                    .subscribe((produitsAssociesData) => {
                      callback(
                        produitData,
                        imgUrl,
                        descriptionMap,
                        produitsRemplacementData,
                        produitsSimilairesData,
                        produitsAssociesData
                      );
                    });
                });
            });
        });
      });
    });
  } */


    getProduit(
      callback: (
        produit: Produit,
        imgUrl: string,
        descriptionMap: Map<string, Array<string>>,
        produitsRemplacement: Array<Produit>,
      //  produitsSimilaires: Array<Produit>,
      produitsAssocies: Array<Produit>,
      produitsRenouvellement: Array<Produit>,
        nbrPhotos: number
      ) => void
    ): void {
      this.route.data.subscribe((data: { produit: ProduitWithDescription }) => {
        const produit$ = data.produit.produit$;
        const description$ = data.produit.description$;
        const produitsRemplacement$ = data.produit.produitsRemplacement$;
       /// const produitsSimilaires$ = data.produit.produitsSimilaires$;
        const produitsAssocies$ = data.produit.produitsAssocies$;
        const nbrPhotos = data.produit.nbrPhotos;
        const produitsRenouvellement$ = data.produit.produitsRenouvellement$;

        // Utilisation de forkJoin pour paralléliser les appels
        forkJoin({
          produit: produit$.pipe(take(1)),
          description: description$.pipe(take(1)),
          produitsRemplacement: produitsRemplacement$.pipe(take(1)),
         // produitsSimilaires: produitsSimilaires$.pipe(take(1)),
          produitsAssocies: produitsAssocies$.pipe(take(1)),
          produitsRenouvellement: produitsRenouvellement$.pipe(take(1))
        }).subscribe(
          ({
            produit,
            description,
            produitsRemplacement,
          //  produitsSimilaires,
            produitsAssocies,
            produitsRenouvellement,
          }) => {
            // Construction de la map des descriptions
            const descriptionMap = new Map<string, Array<string>>();
            description.forEach((desc) => {
              if (desc.description.length > 0) {
                if (!descriptionMap.has(desc.type)) {
                  descriptionMap.set(desc.type, []);
                }
                descriptionMap.get(desc.type).push(desc.description.trim());
              }
            });

            // Construction de l'URL de l'image
            const imgUrl = environment.photosUrl + this._urlImage(produit.photo);

            // Appel du callback avec les données
            callback(
              produit,
              imgUrl,
              descriptionMap,
              produitsRemplacement,
          //    produitsSimilaires,
              produitsAssocies,
              produitsRenouvellement,
              nbrPhotos
            );
          }
        );
      });
    }

  private _urlImage(photo: string, index = 0): string {
    let url = photo.endsWith(".jpg")
      ? photo.substring(0, photo.length - 4)
      : photo;
    if (index) {
      url += `_${index}`;
    }
    return `${url}.webp`;
  }

  formatWeb(web: string): string[] {
    return web.split(/:(.+)/).map((w) => w.trim());
  }

 /*  getProduitsSimilaires(callback: (produitsSimilaires: Array<Produit>) => void): void {
    this.route.data.subscribe((data: { produit: ProduitWithDescription }) => {
      const produitsSimilaires$ = data.produit.produitsSimilaires$;

      produitsSimilaires$.pipe(take(1)).subscribe((produitsSimilaires) => {
        callback(produitsSimilaires);
      });
    });
  } */

  formatProduitPoids(produit: Produit): string {
    return produit.poidsbrut >= 1
      ? `${produit.poidsbrut} kg`
      : `${produit.poidsbrut * 1000} g`;
  }

  isPhoto(ref: string): boolean {
    return /.*\.(jpg|png|jpeg)$/gi.test(ref);
  }

  shouldFormat(strings: Array<string>): boolean {
    return strings.some((string) => string.includes("§"));
  }

  navigateToSimilar(produit: Produit): void {
    const path = [
      "/catalogue/similaire/",
      produit.reference,


    ]

    this.router.navigate(path)

  }

  fullString(strings: Array<string>): string {
    return strings
      .join("")
      .replace(/(?!^ *§)* *§ */g, "\n ●\t")
      .replace(/^\n/g, "")
      .replace(/£/g, "\n\n")
      .trim();


  }

  errorImg(produit: Produit): string {
    return produit.gabarit === "V"
      ? environment.produitVirtuelDefautImgUrl
      : environment.produitDefautImgUrl;
  }

  urlImage(produit: Produit, index = 0): string {
    const baseUrl = produit.photo.endsWith(".jpg")
      ? produit.photo.slice(0, -4)
      : produit.photo;
    if (index == 0) {
      return `${baseUrl}.webp`;
    }
    return `${baseUrl}_${index}.webp`;
  }

  getProduitPdf(reference: string): Observable<Fiche[]> {
    console.log(reference);
   return this.http.get<Fiche[]>(`${environment.apiUrl}/ProduitPDF.php`,{
      params: { pdf: reference },
      responseType: 'json'
    })
  }
}


export interface Fiche {
  url: string;
  label: string;
}
