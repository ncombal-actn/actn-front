import { BreakpointObserver } from "@angular/cdk/layout";
import {
  AfterContentInit,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
} from "@angular/core";
import { WindowService } from "@core/_services";
import { environment } from "@env";

import { Observable, Subject, filter, map, takeUntil } from "rxjs";

import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from "@angular/router";
import { animate, style, transition, trigger } from "@angular/animations";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: "app-onlywan",
  standalone: true,
  templateUrl: "./onlywan.component.html",
  styleUrls: ["./onlywan.component.scss"],
  imports: [
    RouterOutlet,
    MatIcon
  ],
  animations: [
    trigger('routerFade', [
      transition('* => *', [
        style({opacity: 0}),
        animate('0.5s ease', style({opacity: 1}))
      ])
    ])
  ]
})
export class OnlywanComponent implements OnInit,  AfterContentInit, OnDestroy
{
  done = false;

  HideAndSeekArray: string[] = [];

  nav = true;
  public displayEligibilite: boolean = false;
  public environment = environment;
  public userIsConnected: boolean = false;
  offreTemplate: boolean = false;
  public categories: any[] = [
    [
      {
        "name": "Accueil",
        "image": "home",
        "children": [
          {
            "ordre": "10",
            "option": "a",
            "indice": "#",
            "image": "home",
            "nomoption": "Accueil",
            "murl": "onlywan/accueil.html",
            "modeblank": ""
          }
        ]
      }
    ],
    [
      {
        "name": "Outils",
        "image": "build",
        "children": [
          {
            "ordre": "100",
            "option": "b",
            "indice": "",
            "image": "build",
            "nomoption": "Outils",
            "murl": "",
            "modeblank": ""
          },
          {
            "ordre": "120",
            "option": "b",
            "indice": "1",
            "image": "",
            "nomoption": "Test d'éligibilité",
            "murl": "",
            "modeblank": ""
          },
          {
            "ordre": "130",
            "option": "b",
            "indice": "2",
            "image": "",
            "nomoption": "Test ARCEP",
            "murl": "https://cartefibre.arcep.fr/index.html?lng=2.3&lat=46&zoom=9.5&mode=normal&legende=true&filter=true&",
            "modeblank": "t"
          }
        ]
      }
    ],
    [
      {
        "name": "Nos offres",
        "image": "search",
        "children": [
          {
            "ordre": "200",
            "option": "c",
            "indice": "",
            "image": "search",
            "nomoption": "Nos offres",
            "murl": "",
            "modeblank": ""
          },
          {
            "ordre": "210",
            "option": "c",
            "indice": "1",
            "image": "",
            "nomoption": "SIP Trunk",
            "murl": "onlywan/sip-trunk.html",
            "modeblank": ""
          },
          {
            "ordre": "220",
            "option": "c",
            "indice": "2",
            "image": "",
            "nomoption": "Cartes SIM",
            "murl": "onlywan/sim.html",
            "modeblank": ""
          },
          {
            "ordre": "230",
            "option": "c",
            "indice": "3",
            "image": "",
            "nomoption": "Hébergement web",
            "murl": "onlywan/hebergementweb.html",
            "modeblank": ""
          },
          {
            "ordre": "240",
            "option": "c",
            "indice": "4",
            "image": "",
            "nomoption": "Cloud PBX Centrex",
            "murl": "onlywan/cloud-pbx-centrex.html",
            "modeblank": ""
          }
        ]
      }
    ],
    [
      {
        "name": "Mes Clients",
        "image": "people",
        "children": [
          {
            "ordre": "400",
            "option": "e",
            "indice": "",
            "image": "people",
            "nomoption": "Mes Clients",
            "murl": "",
            "modeblank": ""
          },
          {
            "ordre": "410",
            "option": "e",
            "indice": "1",
            "image": "",
            "nomoption": "Liste de mes clients",
            "murl": "",
            "modeblank": ""
          },
          {
            "ordre": "420",
            "option": "e",
            "indice": "2",
            "image": "",
            "nomoption": "Nouveau client",
            "murl": "",
            "modeblank": ""
          }
        ]
      }
    ],
    [
      {
        "name": "Ma consommation",
        "image": "insert_chart",
        "children": [
          {
            "ordre": "500",
            "option": "f",
            "indice": "",
            "image": "insert_chart",
            "nomoption": "Ma consommation",
            "murl": "",
            "modeblank": ""
          },
          /* {
            "ordre": "510",
            "option": "f",
            "indice": "1",
            "image": "insert_chart",
            "nomoption": "Factures",
            "murl": "",
            "modeblank": ""
          }, */
          {
            "ordre": "520",
            "option": "f",
            "indice": "2",
            "image": "insert_chart",
            "nomoption": "CDR",
            "murl": "",
            "modeblank": ""
          }
        ]
      }
    ]
    ,
    [
      {
        "name": "Contacts",
        "image": "phone",
        "children": [
          {
            "ordre": "600",
            "option": "g",
            "indice": "#",
            "image": "phone",
            "nomoption": "Contacts",
            "murl": "onlywan/contact.html",
            "modeblank": ""
          }
        ]
      }
    ]
  ];
  word = "accueil";
  url=""
  private destroy$ = new Subject<void>();
  currentUrl:Observable<string>;
  //private _destroy$ = new Subject<void>();
 /*  @ViewChild(MatSidenav)
  sidenav!: MatSidenav; */
  /**
   *@param breakpointObserver Observe la largeur de l'écran et déclenche un évènement si la largeur passe le cap donné.
   */

  constructor(
    private router: Router,
    private renderer: Renderer2,
    public breakpointObserver: BreakpointObserver,
    public window: WindowService,

    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

this.currentUrl = this.router.events.pipe(
  filter(event => event instanceof NavigationEnd),
  map(()=> this.router.url),
  takeUntil(this.destroy$)
);
this.currentUrl.subscribe(data => {
  // Do something with the currentUrl
  this.url = data;
});
    this.route.url.subscribe();

    this.url = this.router.url;

    if (this.router.url === "/onlywan") {
      this.done = false
   return
    }
    if (this.url.includes(this.word)) {

      this.HideAndSeekArray.push(this.word);

    }


    /* this.http
      .get<any[]>(`${environment.backend}api/ListeOutilsONLYWAN.php`, {
        withCredentials: true,
        responseType: "json",
      })
      .subscribe((data) => {
        this.TableauCategory(data);
      }); */
  }


  show(event: any, className: string) {
    //Vérifie si le noeu a des enfant

    const test = event.target.childNodes.length - 4;

    //chope la classe
    const hasClass = event.target.classList.contains(className);

    if (test == 0) {
    } else {
      if (hasClass) {
        this.renderer.removeClass(event.target, className);
      } else {
        this.renderer.addClass(event.target, className);
      }
    }
  }
 /*  showNav() {
    if (this.nav) {
      this.sidenav.mode = "over";
      this.sidenav.close();
      this.nav = false;
    } else {
      this.sidenav.mode = "side";
      this.sidenav.open();
      this.nav = true;
    }
  } */
  ngAfterContentInit() {
    this.done = true;
  }
  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

 /*  ngAfterViewInit() {
    this.observer.observe(["(max-width: 300px)"]).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = "over";
        this.sidenav.close();
      } else {
        this.sidenav.mode = "side";
        this.sidenav.open();
      }
    });
  } */

  onActivate(event) {
    this.window.scroll(0, 0);
  }

  HideAndSeek(string: string, el: string) {
    this.window.scroll(0, 0);
    string = string.toUpperCase();
    if (el == "Test ASCEP") {
      return;
    }
    if (
      string == "OUTILS" ||
      string == "FACTURATION" ||
      string == "NOS OFFRES" ||
      string == "ETAT DES SERVICES" ||
      string == "MES CLIENTS" ||
      string == "MA CONSOMMATION"
    ) {
      return;
    } else {
      string = string.toLowerCase();
      this.router.navigate([string], { relativeTo: this.route });
      this.HideAndSeekArray = [];
      this.HideAndSeekArray.push(string);
    }
  }
  toCamelCase(str: string): string {
    // Remplacer les caractères spécifiques par "e"
    const replacedStr = str.replace(/[éè]/g, "e");

    // Séparer les mots par des espaces, tirets, underscores et apostrophes
    const words = replacedStr.split(/[\s-_']+/);

    // Convertir le premier mot en minuscules
    let camelCase = words[0].toLowerCase();

    // Convertir les mots suivants avec une majuscule en début
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const capitalized =
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      camelCase += capitalized;
    }
    return camelCase;
  }

  navigateLink(string: string, el: string, cat: string) {
    if (string == "Test ARCEP") {
      window.open(el, "_blank");
      return;
      //this.router.navigateByUrl(el)
      /* const url = this.router.serializeUrl(
    ); */

    }

    cat = this.toCamelCase(cat);

    string = this.toCamelCase(string);

    this.router.navigate([cat + "/" + string], { relativeTo: this.route });
    setTimeout(() => {
      this.HideAndSeekArray = [];
      this.HideAndSeekArray.push(string);
    }, 1);
  }

  TableauCategory(array: any[]) {
    const categories = this.categories;
    let index = 0;
    let sousTableau: any[] = null;
    let test = null;

    array.forEach((element) => {
      index++;
      if (element.option != test) {
        // Si change de catégorie dans le tableau

        sousTableau = [];
        sousTableau.push({
          name: element.nomoption,
          image: element.image,
          children: [element],
        });

        //Fin
        test = element.option;
        if (sousTableau) {
          // on enregistre le tableau de produits précédent

          categories.push(sousTableau);
        }
      } else {
        // on est toujours dans la même catégorie de produits dans 'array'
        sousTableau[0].children.push(element);
      }
    });
    this.done = true;

  }
}
