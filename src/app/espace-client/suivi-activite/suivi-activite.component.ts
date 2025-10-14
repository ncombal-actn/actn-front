import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { Chart, ChartConfiguration, registerables, Colors } from "chart.js";
import { faChartPie, faTable } from "@fortawesome/free-solid-svg-icons";
import { environment } from "@env";
import { HttpClient } from "@angular/common/http";
import { take } from "rxjs";
import { AuthenticationService } from "@core/_services";
Chart.register(...registerables);
Chart.register(Colors);
@Component({
  selector: "app-suivi-activite",
  templateUrl: "./suivi-activite.component.html",
  styleUrls: ["./suivi-activite.component.scss"],
  animations: [
    /**
     * Animation sur la hauteur de l'élément, alterne entre 0 et sa hauteur par défaut.
     * ! Ajouter directement overflow: hidden sur l'élément concerné si besoin de masquer son contenu.
     * L'ajout de cet attribut par l'animation ne fonctionne pas sur Safari !
     */
    trigger("expandVertical", [
      state(
        "open",
        style({
          height: "*",
        })
      ),
      state(
        "closed",
        style({
          height: "0",
        })
      ),
      transition("open => closed", animate("300ms ease-in-out")),
      transition("closed => open", animate("300ms ease-in-out")),
    ]),
  ],
})
export class SuiviActiviteComponent implements AfterViewInit, OnInit {
  protected readonly faTable = faTable;
  protected readonly faChartPie = faChartPie;
  @ViewChildren("pieCanvas", { read: ElementRef })
  pieCanvasRefs: QueryList<ElementRef>;
  @ViewChildren("pieCanvasMarque", { read: ElementRef })
  pieCanvasMarqueRefs: QueryList<ElementRef>;
  @ViewChildren("lineCanvas", { read: ElementRef })
  lineCanvasRefs: QueryList<ElementRef>;
  chart: Chart;
  collapsedIdsArray: string[] = [];
  labeldata: number[] = [];
  suiviCategorieFormat: Array<string> = ["array"];
  categoriesSuiviPizzaCharts: any;
  marquesSuiviPizzaCharts: any;
  renderedCharts = new Set<string>();
  renderedChartsMarque = new Set<string>();
  /**Tooltip */
  matToolTipText = 'placeholder';
	matToolTipPosition = 'above';
  tooltipTableauLogo: string = "Affichage des données en tableau";
  tooltipDiagrameCirculaireLogo: string =
    "Affichage des données en diagrammes circulaires";
  tooltipPosition: string = "left";
  tooltipShowDelay: number = 0;
  tooltipHideDelay: number = 0;

  /** Data Graph */

  clientCA = null;
  caYearArray: string[] = [];
  caBrandArray: string[] = [];
  suiviMarqueFormat: Array<string> = ["array"];
  clientCAcategorie = null;
  caCategorieYearArray: string[] = [];
  caCategorieCategorieArray: string[] = [];

  elements: string[] = [];
  resCa: string[] = [];
  resNombre: string[] = [];
  resQuantite: string[] = [];
  fondBleu = true;
  fondBleu2 = false;
  fondBleu3 = false;

  constructor(private http: HttpClient, private auth : AuthenticationService) {}

  ngOnInit(): void {
    this.collapsedIdsArray.push('graph-mensuel');
    this.produitPHP();
    this.clientCAPHP();
    this.clientGraphMoisPHP();
  }

   ngAfterViewInit() {
     this.clientCACategoriePHP();

    this.pieCanvasRefs.changes.subscribe((changes) => {
      this.pieCanvasRefs.forEach((canvasRef, index) => {

        const canvasId = `piechart${index}`;
        if (!this.renderedCharts.has(canvasId)) {
          this.RenderChart(
            this.categoriesSuiviPizzaCharts[index]?.data.labels,
            this.categoriesSuiviPizzaCharts[index]?.data.datasets[0].data,
            this.categoriesSuiviPizzaCharts[index]?.data.datasets[0]
              .backgroundColor,
            canvasRef.nativeElement,
            "pie"
          );
          this.renderedCharts.add(canvasId);
        }
      });
    });
    this.pieCanvasMarqueRefs.changes.subscribe((changes) => {
      this.pieCanvasMarqueRefs.forEach((canvasRef2, index) => {
        const canvasMarqueId = `piechartMarque${index}`;
        if (!this.renderedChartsMarque.has(canvasMarqueId)) {
          this.RenderChart(
           this.caBrandArray// this.marquesSuiviPizzaCharts[index]?.labels //filteredLabelData ,
            ,this.marquesSuiviPizzaCharts[index]?.values,//filteredValueData
            ["red", "green"],//this.marquesSuiviPizzaCharts[index]?.colors,// ,
            canvasRef2.nativeElement,
            "pie"
          );
          this.renderedChartsMarque.add(canvasMarqueId);
        }
      });
    });

  }

  /**
   * Launch request to "ClientCA.php" and subsequent functions
   */
  clientCAPHP(): void {
    this.http
      .get<any>(`${environment.apiUrl}/ClientCA.php`, {
        withCredentials: true,

      })
      .pipe(take(1))
      .subscribe(
        (ret) => {
          if (ret && ret.length > 0) {

            this.clientCA = ret.reduce(this.reduceAndSortClientCA, {});
            this.caYearArray.sort((a: any, b: any) => a - b);
            this.caBrandArray.sort((a: any, b: any) => a - b);

            this.marquesSuiviPizzaCharts = this.buildPizzaChart(
              this.caYearArray,
              this.caBrandArray,
              this.clientCA,
              true
            );
          }
        }
      );
  }

  clientGraphMoisPHP() {
    this.http
      .get<any[]>(`${environment.apiUrl}/ClientCAmois.php`, {
        withCredentials: true,


      })
      .pipe(take(1))
      .subscribe((ret: any) => {
        if (ret && ret.length > 0) {
          ret = this.contruireUnGraphiqueCommeUnVraiHomme(ret);
        }
      });
  }

  contruireUnGraphiqueCommeUnVraiHomme(ret: any[]) {

    const tableauDeTableaux = ret.reduce((acc, obj) => {
      // Vérifier si la catégorie existe déjà dans l'accumulateur
      const existingCategory = acc.find(
        (item) => item[0].categorie === obj.categorie
      );

      if (existingCategory) {
        // Si la catégorie existe déjà, ajouter l'objet à son tableau correspondant
        existingCategory.push(obj);
        existingCategory.sort((a, b) => a.anmois.localeCompare(b.anmois));
      } else {
        // Si la catégorie n'existe pas encore, ajouter un nouveau tableau avec cet objet
        acc.push([obj]);
      }

      return acc;
    }, []);

    const series = tableauDeTableaux.map((tableau) => {
      const categorie = tableau[0].categorie;
      const data = tableau.map((obj) => parseFloat(obj.ca));
      return { name: categorie, data: data };
    });

    const tableauAvecPlusGrandeTaille = tableauDeTableaux.reduce(
      (acc, tableau) => {
        return tableau.length > acc.length ? tableau : acc;
      },
      []
    );
    const mois = tableauAvecPlusGrandeTaille.map((obj) => {
      // Le champ "anmois" est supposé être dans le format "YYYY-MM", donc nous devons extraire les deux derniers caractères pour obtenir le mois
      return obj.anmois;
      // Extrait les deux derniers caractères
    });

    this.createLineChart(series, mois);
  }

  createLineChart(apiData: any[], labels: any[]): void {
    const datasets = apiData.map((item) => ({
      label: item.name,
      data: item.data,
      fill: false,
    }));

    this.chart = new Chart("lineCanvas", {
      type: "line",
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,

        scales: {
          x: {
            display: true,
          },
          y: {
            display: true,
          },
        },
      },
    });
  }

  /**
   * Reducer callback for sorting the return of ClientCA.php
   */
  reduceAndSortClientCA = (
    accumulator,
    currentValue,
    currentIndex,
    arrayInUse
  ): any => {
    // marque is not already in 'caBrandArray'
    //  add it
    if (!this.caBrandArray.includes(currentValue.marque)) {
      this.caBrandArray.push(currentValue.marque);
      accumulator[currentValue.marque] = {};
    }
    // annee is not already in 'caYearArray'
    //  add it
    if (!this.caYearArray.includes(currentValue.annee)) {
      this.caYearArray.push(currentValue.annee);
    }

    // add to accumulator
    accumulator[currentValue.marque][currentValue.annee] = currentValue.ca;
    return accumulator;
  };

  RenderChart(
    labeldata: any[],
    valuedata: any[],
    colordata: any,
    canvas: HTMLCanvasElement,
    charttype: any,

  ) {

    if (!canvas || !labeldata || !valuedata || !colordata) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    // Filter out values that are 0 and get the corresponding indices
  const filteredIndices = valuedata
  .map((value, idx) => (value !== 0 ? idx : -1))
  .filter(idx => idx !== -1);

// Filter labeldata and valuedata based on the filtered indices
const filteredLabelData = filteredIndices.map(idx => labeldata[idx]);
const filteredValueData = filteredIndices.map(idx => valuedata[idx]);
//const filteredColorData = filteredIndices.map(idx => colordata[idx]);

const getRandomColor = (index, totalColors) => {
  const hue = Math.floor((index / totalColors) * 360); // Evenly distribute hues
  const saturation = 50 + Math.floor(Math.random() * 20); // Saturation: 80% to 100%
  const lightness = 60 + Math.floor(Math.random() * 20); // Lightness: 50% to 60%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Generate unique colors for each data point with better contrast
const uniqueColors = filteredValueData.map((_, index) => getRandomColor(index, filteredValueData.length));

    new Chart(ctx, {
      type: charttype,
      data: {
        labels: filteredLabelData,
        datasets: [
          {
            label: "Yearly sales",
            data: filteredValueData,
            backgroundColor: uniqueColors,

          },
        ],
      },

      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  clientCACategoriePHP(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.http
          .get<any>(`${environment.apiUrl}/ClientCAcategorie.php`, {
            withCredentials: true,


          })
          .pipe(take(1))
          .subscribe((ret) => {
            if (ret && ret.length > 0) {
              this.clientCAcategorie = ret.reduce(
                this.reduceAndSortClientCAcategorie,
                {}
              );
              this.caCategorieYearArray.sort((a: any, b: any) => a - b);
              this.caCategorieCategorieArray.sort((a: any, b: any) => a - b);
              this.caCategorieCategorieArray.push("TOTAL");

              this.categoriesSuiviPizzaCharts = this.buildPizzaCharts(
                this.caCategorieYearArray,
                this.caCategorieCategorieArray,
                this.clientCAcategorie
              );


              resolve();

            }
          });

      }, 1000);
    });
  }

  /**
   * Reducer callback for sorting the return of ClientCAcategorie.php
   */
  reduceAndSortClientCAcategorie = (
    accumulator,
    currentValue,
    currentIndex,
    arrayInUse
  ): void => {
    // categorie is not already in 'caCategorieBrandArray'
    //  add it
    if (!this.caCategorieCategorieArray.includes(currentValue.categorie)) {
      this.caCategorieCategorieArray.push(currentValue.categorie);
      accumulator[currentValue.categorie] = {};
    }
    // annee is not already in 'caCategorieYearArray'
    //  add it
    if (!this.caCategorieYearArray.includes(currentValue.annee)) {
      this.caCategorieYearArray.push(currentValue.annee);
    }
    // add to accumulator
    accumulator[currentValue.categorie][currentValue.annee] = currentValue.ca;
    return accumulator;
  };

  /**
   * Constuit les pizzaCharts de "Suivi d'activité par catégories"
   */
  buildPizzaChart(
    annees: Array<string>,
    categories: Array<string>,
    categoriesAnneesAmount: Array<Array<string>>,
    bigCharts: Boolean = false
  ): Array<PizzaChart> {
    let cookingPizzaChart: PizzaChart = null;
    let pizzaCharts: Array<PizzaChart> = [];

    annees.forEach((annee) => {
      cookingPizzaChart = new PizzaChart();
      if (bigCharts) {
        // agrandit les charts si 'bigCharts' est true
        cookingPizzaChart.params.width = 500;
      }
      categories.forEach((categorie) => {
        if (categorie && categorie != "TOTAL") {
          if (categoriesAnneesAmount[categorie][annee]) {
            if (categorie == ".") {
              cookingPizzaChart.labels.push("Autres");
            } else {
              cookingPizzaChart.labels.push(categorie);
            }
            cookingPizzaChart.values.push(
              Number(categoriesAnneesAmount[categorie][annee])
            );
            cookingPizzaChart.colors.push("#555555");
          } else {
            cookingPizzaChart.values.push(0);
          }
        }
      });
      pizzaCharts.push(cookingPizzaChart);
    });
    return pizzaCharts;
  }

  // SUIVI CATEGORIE FUNCTIONS
  toggleMarqueSuiviFormat(keyOfElement: string): void {
    let index = this.suiviMarqueFormat.indexOf(keyOfElement);
    if (index != -1) {
      // keyOfElement est dans le tableau
      this.suiviMarqueFormat.splice(index, 1);
    } // keyOfElement n'est pas dans le tableau
    else {
      this.suiviMarqueFormat.push(keyOfElement);
    }
  }

  buildPizzaCharts(
    annees: Array<string>,
    categories: Array<string>,
    categoriesAnneesAmount: { [key: string]: { [key: string]: string } },
    bigCharts: Boolean = false
  ): Array<ChartConfiguration> {
    let pizzaCharts: Array<ChartConfiguration> = [];
    annees.forEach((annee) => {
      let chartConfig: ChartConfiguration = {
        type: "pie",
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              backgroundColor: [],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: !bigCharts,
          // width: bigCharts ? 500 : undefined
        },
      };

      categories.forEach((categorie) => {
        if (categorie && categorie != "TOTAL") {
          if (
            categoriesAnneesAmount[categorie] &&
            categoriesAnneesAmount[categorie][annee]
          ) {
            chartConfig.data.labels.push(
              categorie == "." ? "Autres" : categorie
            );
            chartConfig.data.datasets[0].data.push(
              Number(categoriesAnneesAmount[categorie][annee])
            );
            //  chartConfig.data.datasets[0].backgroundColor.push("#555555");
          }
        }
      });

      pizzaCharts.push(chartConfig);
    });

    return pizzaCharts;
  }

  // SUIVI CATEGORIE FUNCTIONS
  toggleCategorieSuiviFormat(keyOfElement: string,array:number): void {
 //   Si on est dans le premier tableau
    if (array === 1) {

      let index = this.suiviCategorieFormat.indexOf(keyOfElement);

      if (index != -1) {
        // keyOfElement est dans le tableau
        this.suiviCategorieFormat.splice(index, 1);
      } // keyOfElement n'est pas dans le tableau
      else {
        this.suiviCategorieFormat.push(keyOfElement);
      }
    }else{


      let index = this.suiviMarqueFormat.indexOf(keyOfElement);

    if (index != -1) {
      // keyOfElement est dans le tableau
      this.suiviMarqueFormat.splice(index, 1);
    } // keyOfElement n'est pas dans le tableau
    else {
      this.suiviMarqueFormat.push(keyOfElement);
    }
    }

  }

  //niqueLAPolice

  /**
   * Ouvre ou ferme un élément.
   * @param event L'élément DOM déclencheur
   * @param id L'identifiant de l'élément
   */
  toggleCollapseDivById(event, id: string): void {
    // On vérifie que l'on a pas à faire à un sous-évenement pour ne pas déclencher plusieurs fois le handler.
    if (!event.srcEvent) {
      if (this.collapsedIdsArray.includes(id)) {
        this.collapsedIdsArray.splice(this.collapsedIdsArray.indexOf(id), 1); // retirer l'id de collapsedIdsArray
      } else {
        this.collapsedIdsArray.push(id); // ajouter l'id à collapsedIdsArray
      }
    }
  }

  produitPHP() {
    this.http
      .get<any>(`${environment.apiUrl}/ClientHitProduit.php`, {
        withCredentials: true,



      })
      .pipe(take(1))
      .subscribe(
        (ret) => {
          if (ret && ret.length > 0) {

            this.resCa = this.classementCa(ret);
            this.resNombre = this.classementNombre(ret);
            this.resQuantite = this.classementQuantite(ret);
            this.affichageNombre();

          }
        },
      );
  }

  classementCa(tab) {
    tab.sort((a, b) => b.nombre - a.nombre);
    tab.sort((a, b) => b.quantite - a.quantite);
    tab.sort((a, b) => b.ca - a.ca);
    return tab.slice(0, 20);
  }

  classementNombre(tab) {
    tab.sort((a, b) => b.ca - a.ca);
    tab.sort((a, b) => b.quantite - a.quantite);
    tab.sort((a, b) => b.nombre - a.nombre);
    return tab.slice(0, 20);
  }
  classementQuantite(tab) {
    tab.sort((a, b) => b.ca - a.ca);
    tab.sort((a, b) => b.nombre - a.nombre);
    tab.sort((a, b) => b.quantite - a.quantite);
    return tab.slice(0, 20);
  }

  affichageNombre() {
    this.elements = this.resNombre;
    this.fondBleu = true;
    this.fondBleu2 = false;
    this.fondBleu3 = false;
  }

  affichageCa() {
    this.elements = this.resCa;
    this.fondBleu = false;
    this.fondBleu2 = true; // Mettre à jour la variable fondVert
    this.fondBleu3 = false;
  }

  affichageQuantite() {
    this.elements = this.resQuantite;
    this.fondBleu = false;
    this.fondBleu2 = false; // Mettre à jour la variable fondVert
    this.fondBleu3 = true;
  }
}

class PizzaChart {
  values: Array<any> = [];
  labels: Array<string> = [];
  colors: Array<string> = [
    "#008ffb",
    "#00e396",
    "#feb019",
    "#ff4560",
    "#775dd0",
    "#6ebdec",
    "#CBF340",
    "#d3860c",
    "#fdc8c0",
    "#c54f6b",
    "#009489",
    "#008ffb",
    "#00e396",
    "#feb019",
    "#ff4560",
    "#775dd0",
    "#6ebdec",
    "#CBF340",
    "#d3860c",
    "#fdc8c0",
    "#c54f6b",
    "#009489",
    "#008ffb",
    "#00e396",
    "#feb019",
    "#ff4560",
    "#775dd0",
    "#6ebdec",
    "#CBF340",
    "#d3860c",
    "#fdc8c0",
    "#c54f6b",
    "#009489",
  ];
  params: { width: number; type: string } = { width: 380, type: "pie" };
  responsive: any = [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ];
}
