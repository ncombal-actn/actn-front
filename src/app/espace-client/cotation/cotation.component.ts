import { Component, OnInit, OnDestroy } from "@angular/core";
import { environment } from "@env";
import { ProduitService } from "@core/_services/produit.service";
import { CotationService } from "@core/_services/cotation.service";
import { AuthenticationService } from "@core/_services/authentication.service";
import { Produit, Cotation } from "@/_util/models";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil, take } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import * as XLSX from "xlsx";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: "app-cotation",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardContent,
    MatCard,
    MatCardHeader,
    MatFormField,
    MatIcon,
    MatLabel,
    MatSlideToggle
  ],
  templateUrl: "./cotation.component.html",
  styleUrls: ["./cotation.component.scss"],
})
export class CotationComponent implements OnInit, OnDestroy {
  environment = environment;

  cotationMap = new BehaviorSubject<
    Map<string, { produit: Produit; cotation: Cotation }[]>
  >(new Map());
  disabledCotationMap = new BehaviorSubject<
    Map<string, { produit: Produit; cotation: Cotation }[]>
  >(new Map());

  filteredCotationMap = new BehaviorSubject<
    Map<string, { produit: Produit; cotation: Cotation }[]>
  >(new Map());
  filteredDisabledCotationMap = new BehaviorSubject<
    Map<string, { produit: Produit; cotation: Cotation }[]>
  >(new Map());
  showDisabledCotation= false;
  todaysDate: Date = new Date();
  dateMap: Map<string, number> = new Map();

  display = [];
  disabledDisplay = [];
  marqueArray: Array<string> = [];
  filterForm: FormGroup = new FormGroup({});
  disabledRenewalButtons: number[] = [];

  private _destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    public produitService: ProduitService,
    private cotationService: CotationService,
    private auth: AuthenticationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      cotation: [""],
      refCotation: [""],
      marque: [[]],
      prod: [""],
      date: [""],
    });

    this.cotationService.getCotations();
    this.cotationService.cotations$ // SUB TO COTATIONS
      .pipe(takeUntil(this._destroy$))
      .subscribe((cotations: Cotation[]) => {
        const cotationMap = this.cotationMap.value;
        //	this.cotationMap = new Map<string, any[]>(); // reset cotationMap at each trigger of the subscribe
        this.dateMap = new Map<string, number>();
        cotations.forEach((cotation) => {

          const produit = new Produit();
          produit.reference = cotation.produit as string;
          produit.qtemaxi = cotation.qtecdemax - cotation.qtecde;
          produit.qtemini = 0;
          // produit.qtemini = ((cotation.nbrcdemax - cotation.nbrcde) == 1) ? produit.qtemaxi : 0; // si c'est la dernière commande possible de la cotation, le client doit acheter tout les produis restants
          produit.qteStock1 = cotation.qtestock;
          produit.prix = cotation.prixvente;
          produit.marque = cotation.marquelib;
          produit.designation = cotation.designation;
          produit.photo = cotation.produit;
          produit.perm = cotation.perm;
		if (cotationMap.get(cotation.numcotation)) { // add a product to a cotation already in the set
            cotationMap.set(cotation.numcotation, [...(cotationMap.get(cotation.numcotation) ?? []), { produit: produit, cotation: cotation }]);
          } else { // add a cotation and product to the set
            cotationMap.set(cotation.numcotation, [{ produit: produit, cotation: cotation }]);
          }
          this.cotationMap.next(cotationMap);
	this.filteredCotationMap.next(cotationMap);

          this.dateMap.set(
            cotation.numcotation.toString(),
            this.cotationService.dateDifferenceInDays(
              cotation.datefin,
              this.todaysDate
            )
          );
        });
      });
    this.cotationService.disabledCotations$ // SUB TO DISABLED COTATIONS
      .pipe(takeUntil(this._destroy$))
      .subscribe((cotations: Cotation[]) => {
        const disabledCotationMap = this.disabledCotationMap.value;

        //this.disabledCotationMap = new Map<string, any[]>(); // reset disabledCotationMap at each trigger of the subscribe
        this.cotationService.getInvalidReasons(cotations);
        cotations.forEach((cotation) => {
          const produit = new Produit();
          produit.reference = cotation.produit as string;
          produit.qtemaxi = cotation.qtecdemax - cotation.qtecde;
          produit.qtemini = 0;
          // produit.qtemini = ((cotation.nbrcdemax - cotation.nbrcde) == 1) ? produit.qtemaxi : 0; // si c'est la dernière commande possible de la cotation, le client doit acheter tout les produis restants
          produit.qteStock1 = cotation.qtestock;
          produit.prix = cotation.prixvente;
          produit.marque = cotation.marque;
          produit.designation = cotation.designation;
          produit.photo = cotation.produit;
          //produit.ncotation = Number(cotation.numcotation);
          if (disabledCotationMap.get(cotation.numcotation)) {
            // add a product to a cotation already in the set
            disabledCotationMap.set(cotation.numcotation, [
              ...(disabledCotationMap.get(cotation.numcotation) ?? []),
              { produit: produit, cotation: cotation },
            ]);
          } else {
            // add a cotation and product to the set
            disabledCotationMap.set(cotation.numcotation, [
              { produit: produit, cotation: cotation },
            ]);
          }
        });
        this.disabledCotationMap.next(disabledCotationMap);
		this.filteredDisabledCotationMap.next(disabledCotationMap);
		// update marqueArray with unique marques from cotations
		this.updateMarqueArray();
      });
    this.filterForm.valueChanges.subscribe((values) => {
      this.filterCotations(values);
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  clearFilter(controlName: string): void {
    const control = this.filterForm.get(controlName);
    if (control) {
      control.setValue(controlName === "marque" ? [] : ""); // Clear array for marque, empty string for others
    }
  }

  filtreMarqueToggle(marque: string): void {
    const control = this.filterForm.get('marque');
    if (control) {
      const currentMarques = control.value as string[];
      if (currentMarques.includes(marque)) {
        control.setValue(currentMarques.filter(m => m !== marque));
      } else {
        control.setValue([...currentMarques, marque]);
      }
    }
  }

   exportToExcel(cotation?): void {
    if (cotation) {
      const data = cotation.value.map(item => ({
        NumCotation: `${item.cotation.numfrs} - ${cotation.key}`,
        Reference: item.produit.reference,
        Marque: item.cotation.marquelib,
        Designation: item.produit.designation,
        Prix: item.produit.prix,
        QuantiteMaxi: item.produit.qtemaxi,
        QuantiteMini: item.produit.qtemini,
        DateDebut: item.cotation.datedeb,
        DateFin: item.cotation.datefin
      }));
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Cotation ' + cotation.key);
      XLSX.writeFile(wb, 'Cotation ' + cotation.key + '.xlsx');
    } else {
      const data = [
        ...this.getCotationData(this.cotationMap.value, 'Oui'),
        ...this.getCotationData(this.disabledCotationMap.value, 'Non')
      ];
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Cotations');
      XLSX.writeFile(wb, 'Cotations.xlsx');
    }
  }

private getCotationData(map: Map<string, any[]>, activeStatus: string) {
    return Array.from(map.entries()).flatMap(([key, value]) => value.map(item => ({
      NumCotation: `${item.cotation.numfrs} - ${key}`,
      Reference: item.produit.reference,
      Marque: item.cotation.marquelib, // on prend la marque de la cotation, car le produit est pas défini
      Designation: item.produit.designation,
      Prix: item.produit.prix,
      QuantiteMaxi: item.produit.qtemaxi,
      QuantiteMini: item.produit.qtemini,
      DateDebut: item.cotation.datedeb,
      DateFin: item.cotation.datefin,
      Active: activeStatus
    })));
  }

  clearAllFilters(): void {
    this.filterForm.reset({
      cotation: "",
      refCotation: "",
      marque: [],
      prod: "",
    });
    this.showDisabledCotation = false; // Reset the toggle state

  }
  showDisabledCotationToggle(): void {
    this.showDisabledCotation = !this.showDisabledCotation;
  }

  updateMarqueArray(): void {
    const marques = new Set<string>();

    this.cotationMap.value.forEach(value => {
      value.forEach(item => {
        marques.add(item.produit.marque);
      });
    });

    this.disabledCotationMap.value.forEach(value => {
      value.forEach(item => {
        marques.add(item.produit.marque);
      });
    });

    this.marqueArray = Array.from(marques);
  }




  filterCotations(values: any): void {

	const filteredCotations = new Map<string, { produit: Produit; cotation: Cotation }[]>();
	this.cotationMap.value.forEach((value, key) => {
	const filteredValue = value.filter(item => {

		return (!values.cotation || item.cotation.numcotation.toLowerCase().includes(values.cotation.toLowerCase())) &&
			(!values.refCotation || item.cotation.refcot.toLowerCase().includes(values.refCotation.toLowerCase())) &&
			(!values.marque.length || values.marque.includes(item.produit.marque)) &&
			(!values.prod || item.produit.reference.toLowerCase().includes(values.prod.toLowerCase())) &&
			(!values.date || new Date(item.cotation.datedeb).toLocaleDateString().includes(values.date));
	});
	if (filteredValue.length > 0) {
		filteredCotations.set(key, filteredValue);
	}
	});

	const filteredDisabledCotations = new Map<string, { produit: Produit; cotation: Cotation }[]>();
	this.disabledCotationMap.value.forEach((value, key) => {
	const filteredValue = value.filter(item => {
		return (!values.cotation || item.cotation.numcotation.toLowerCase().includes(values.cotation.toLowerCase())) &&
			(!values.refCotation || item.cotation.refcot.toLowerCase().includes(values.refCotation.toLowerCase())) &&
			(!values.marque.length || values.marque.includes(item.produit.marque)) &&
			(!values.prod || item.produit.reference.toLowerCase().includes(values.prod.toLowerCase())) &&
			(!values.date || new Date(item.cotation.datedeb).toLocaleDateString().includes(values.date));
	});
	if (filteredValue.length > 0) {
		filteredDisabledCotations.set(key, filteredValue);
	}
	});

	this.filteredCotationMap.next(filteredCotations);
	this.filteredDisabledCotationMap.next(filteredDisabledCotations);
  }


  askForRenewal(cotationNbr, buttonNbr, numfrs, numref): void {
    this.disabledRenewalButtons.push(buttonNbr);

    this.http
      .get(`${environment.apiUrl}/askForCotationRenewalByMail.php`, {
        withCredentials: true,
        responseType: "text",
        params: {
          cotation: cotationNbr,
          numfrs: numfrs,
          numref: numref,
        },
      })
      .pipe(take(1))
      .subscribe(
        (ret) => {},
        (error) => {
          this.disabledRenewalButtons.splice(
            this.disabledRenewalButtons.indexOf(buttonNbr),
            1
          );
        }
      );
  }

 unrollDetails(index: number): void {
    this.display[index] = !this.display[index];
  }

  unrollDisabledDetails(index: number): void {
    this.disabledDisplay[index] = !this.disabledDisplay[index];
  }
}
