import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DematerialisationService } from '@core/_services/dematerialisation.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-dematerialisation',
  templateUrl: './dematerialisation.component.html',
  styleUrls: ['./dematerialisation.component.scss']
})
export class DematerialisationComponent implements OnInit {

  loading: boolean = false;
  submitted: boolean = false;
  success: boolean = false;
  dematForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dematerialisation: DematerialisationService
  ) {

  }

  ngOnInit() {
    this.dematForm = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'nom': ['', Validators.required],
      'tel': ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/^[0-9+_ -]+$/)]],
    })
  }

  onSubmit(): void {
    this.loading = true;
    this.submitted = true;
    this.dematerialisation.submitNewContact(this.dematForm.get('email').value, this.dematForm.get('nom').value, this.dematForm.get('tel').value)
    .subscribe(reponse => this.reponseRecu(reponse))
    /*.pipe(take(1))
    .subscribe(
        (ret) =>
        {

        },
        (error) =>
        {
          console.error("'IDutilisateur.php' failed", error);
        }
      )
    */
  }

  reponseRecu(reponse: any): void {

    if (reponse[0].erreur =="N") {
      this.success = true

    }else{
      this.success = false
    }
    this.loading = false;
  }

}
