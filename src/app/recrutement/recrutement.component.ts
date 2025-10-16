import {HttpClient, HttpParams, HttpRequest} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '@env';
import {Subject} from 'rxjs';
import {take} from 'rxjs/operators';
import {MatIcon} from "@angular/material/icon";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {TitleWLineComponent} from "@/_util/components/title-w-line/title-w-line.component";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-recrutement',
  standalone: true,
  imports: [
    MatIcon,
    MatLabel,
    MatFormField,
    ReactiveFormsModule,
    TitleWLineComponent,
    MatSelect,
    MatOption,
    MatInput,
    MatSuffix
  ],
  templateUrl: './recrutement.component.html',
  styleUrls: ['./recrutement.component.scss'],
})
export class RecrutementComponent implements OnInit, OnDestroy {

  environment = environment;
  postes: any[];  //Observable<Array<{ intitule: string; details: Array<string>; }>>;
  recrutementForm: FormGroup;
  erreur = false;
  selectedFile: File | null = null;
  private _destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.recrutementForm = this.formBuilder.group({
      poste: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      file: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {

    this.http.get<Array<{ intitule: string; details: Array<string>; }>>(
      `${environment.apiUrl}/postes.php`,
      {
        withCredentials: true,
        responseType: 'json'
      }).subscribe(data => {
      this.postes = data;
    })

  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }


  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  onSubmit(): void {
    this.recrutementForm.markAllAsTouched();
    if (!this.recrutementForm.invalid) {
      const file = this.selectedFile //this.recrutementForm.get('file').value._files[0] as File;
      const filename = this.selectedFile.name //this.recrutementForm.get('file').value._fileNames as string;
      const data = {
        poste: this.recrutementForm.get('poste').value as string,
        nom: this.recrutementForm.get('nom').value as string,
        prenom: this.recrutementForm.get('prenom').value as string,
        email: this.recrutementForm.get('email').value as string,
        telephone: this.recrutementForm.get('telephone').value as string,
        file: filename
      };

      const formData = new FormData();
      formData.append('upload', file);
      const paramsO = new HttpParams();
      const options = {
        params: paramsO,
        reportProgress: true,
      };

      const req = new HttpRequest('POST', `${environment.apiUrl}/candidature_file.php`, formData, options);
      this.http.request(req).pipe().subscribe(event => {
        if (event.type === 4) {
          this.http.post<boolean>(
            `${environment.apiUrl}/candidature.php`,
            {...data},
            {withCredentials: true}
          ).pipe(take(1))
            .subscribe(ret => {
              if (ret) {
                this.router.navigate(['validation-recrutement'], {relativeTo: this.route});
              } else {
                this.erreur = true;
              }
            });
        }
      });
    }
  }

}
