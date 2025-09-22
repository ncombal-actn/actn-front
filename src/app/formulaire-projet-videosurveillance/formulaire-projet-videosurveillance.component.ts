import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@core/_services';
import { environment } from '@env';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

//import { ScrollToDirective } from '@nicky-lenaers/ngx-scroll-to';



@Component({
  selector: 'app-formulaire-projet-videosurveillance',
  templateUrl: './formulaire-projet-videosurveillance.component.html',
  styleUrls: ['./formulaire-projet-videosurveillance.component.scss']
})
export class FormulaireProjetVideosurveillanceComponent {

  environment = environment;
  videoSurveillanceForm: FormGroup;
  formError = false;
  sendError = false;
  nombre_cameras = "";
  textfield = "" ;
  textfield2 = "" ;
  logiciel_OS = "" ;
  visualisation_resolution = "" ;
  nb_img_par_seconde = "" ;
  compression = "" ;
  logiciel_bandepassantelien = "" ;
  stockage_duree_enregistrement = "";
  recuperation_data_bandepassante = "";
  recuperation_data_distance = "";
  description_projet = "";
  fileToUpload: File | null = null;


  // formulairesProjetsVideosurveillances: Array<FormulaireProjetVideosurveillance> = null;
  // private _formulairesProjetsVideosurveillances = new BehaviorSubject<Array<FormulaireProjetVideosurveillance>>([]);

  private _destroy$ = new Subject<void>();

  // get formulairesProjetsVideosurveillances(): Array<FormulaireProjetVideosurveillance> {
	// 	return this._formulairesProjetsVideosurveillances.value;
	// }
	// get formulairesProjetsVideosurveillances$(): Observable<Array<FormulaireProjetVideosurveillance>>
  //  {
	// 	return this._formulairesProjetsVideosurveillances.asObservable();
	// }

  constructor(
    private fb: FormBuilder,
    public authService: AuthenticationService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute) {


    // type NewType = Array<FormulaireProjetVideosurveillance>;

    // this.http.get<any>(
    //   `${environment.apiUrl}/envoiPriseBesoinVideo.php`,
    //   {
    //     withCredentials: true,
    //     responseType: 'json',
    //     params: {
    //       nombre_camera: this.videoSurveillanceForm.value.camera.nombre_cameras,
    //     }
    //   })
    //   .pipe(take(1))
    //   .subscribe(formulairesProjetsVideosurveillances => this._formulairesProjetsVideosurveillances.next(formulairesProjetsVideosurveillances));


    this.videoSurveillanceForm = fb.group({
      // identite: this.fb.group({
        societe: [this.authService.currentUser?.name, [Validators.required]],
        clientID: [this.authService.currentUser?.id, [Validators.required]],
        nom: [this.authService.currentUser?.TIERSNOM],
        fonction: [''],
        email: [this.authService.currentUser?.TIERSMEL, [Validators.required, Validators.email]],
        telephone: [this.authService.currentUser?.TIERSTEL],
      // }),

  //     camera: this.fb.group({
  //       nombre_cameras: ['', [Validators.required] ],
  //       camera_type: ['', [Validators.required] ],
  //       camera_resolution: ['', [Validators.required] ],
  //       camera_journuit: ['', [Validators.required] ],
  //       camera_utilisation: ['', [Validators.required] ],
  //       camera_sansfil: ['', [Validators.required] ],
  //       camera_objectif: ['', [Validators.required] ],
  //       camera_antivandale: ['', [Validators.required] ],
  //       camera_compression_video: ['', [Validators.required] ],
  //       textfield: ['', [Validators.required] ],
  //       textfield2: ['', [Validators.required] ],
  //       camera_usage: ['', [Validators.required] ],
  //       camera_fixation: ['', [Validators.required] ],
  //       camera_alimentation: ['', [Validators.required] ],
  //       camera_ES: ['', [Validators.required] ]
  //     }),
  //     eclairage: this.fb.group({
  //       eclairage_projecteur: ['', [Validators.required] ]
  //     }),
  //     visualisation: this.fb.group({
  //       logiciel_OS: ['', [Validators.required] ],
  //       logiciel_utilisation: ['', [Validators.required] ],
  //       logiciel_consultation: ['', [Validators.required] ],
  //       logiciel_consultation_: ['', [Validators.required] ],
  //       visualisation_resolution: ['', [Validators.required] ],
  //       nb_img_par_seconde: ['', [Validators.required] ],
  //       compression: ['', [Validators.required] ],
  //       logiciel_bandepassantelien: ['', [Validators.required] ]
  //     }),
  //     stockage: this.fb.group({
  //       stockage_resolution: ['', [Validators.required] ],
  //       stockage_imgs: ['', [Validators.required] ],
  //       stockage_compression: ['', [Validators.required] ],
  //       stockage_mode_enregistrement: ['', [Validators.required] ],
  //       stockage_duree_enregistrement: ['', [Validators.required] ],
  //     }),
  //     recuperation_donnees: this.fb.group({
  //       recuperation_data_lien: ['', [Validators.required] ],
  //       recuperation_data_bandepassante: ['', [Validators.required] ],
  //       recuperation_data_distance: ['', [Validators.required] ]
  //     }),
  //     marques: this.fb.group({
  //       marque: ['', [Validators.required] ]
  //     }),
  //     informations_complementaires: this.fb.group({
  //       description_projet: ['', [Validators.required] ]
  //     }),

    });

  }

  onSubmit(): boolean {
    let camera_type: string = "", camera_resolution: string = "", camera_journuit: string = "",
      camera_utilisation: string = "", camera_sansfil: string = "", camera_objectif: string = "",
      camera_antivandale: string = "", camera_compression_video: string = "", camera_usage: string = "",
      camera_fixation: string = "", camera_alimentation: string = "", camera_ES: string = "",
      eclairage_projecteur: string = "";
    eclairage_projecteur = "";
    const logiciel_utilisation: string = "", logiciel_consultation: string = "", logiciel_consultation_: string = "",
      stockage_resolution: string = "", stockage_imgs: string = "", stockage_compression: string = "",
      stockage_mode_enregistrement: string = "", recuperation_data_lien: string = "", marque: string = "";
    let arr_camera_type: string[] = [], arr_camera_resolution: string[] = [], arr_camera_journuit: string[] = [],
      arr_camera_utilisation: string[] = [], arr_camera_sansfil: string[] = [], arr_camera_objectif: string[] = [],
      arr_camera_antivandale: string[] = [], arr_camera_compression_video: string[] = [],
      arr_camera_usage: string[] = [], arr_camera_fixation: string[] = [], arr_camera_alimentation: string[] = [],
      arr_camera_ES: string[] = [], arr_eclairage_projecteur: string[] = [];
    arr_eclairage_projecteur = [];
    const arr_logiciel_utilisation: string[] = [], arr_logiciel_consultation: string[] = [],
      arr_logiciel_consultation_: string[] = [], arr_stockage_resolution: string[] = [],
      arr_stockage_imgs: string[] = [], arr_stockage_compression: string[] = [],
      arr_stockage_mode_enregistrement: string[] = [], arr_recuperation_data_lien: string[] = [],
      arr_marque: string[] = [];
    const formData = new FormData();

    /*
      $("input:checkbox[name=camera_type]:checked").each(function(){ camera_type.push($(this).val()); });
      $("input:checkbox[name=camera_resolution]:checked").each(function(){ camera_resolution.push($(this).val()); });
      $("input:checkbox[name=camera_journuit]:checked").each(function(){ camera_journuit.push($(this).val()); });
      $("input:checkbox[name=camera_utilisation]:checked").each(function(){ camera_utilisation.push($(this).val()); });
      $("input:checkbox[name=camera_sansfil]:checked").each(function(){ camera_sansfil.push($(this).val()); });
      $("input:checkbox[name=camera_objectif]:checked").each(function(){ camera_objectif.push($(this).val()); });
      $("input:checkbox[name=camera_antivandale]:checked").each(function(){ camera_antivandale.push($(this).val()); });
      $("input:checkbox[name=camera_compression_video]:checked").each(function(){ camera_compression_video.push($(this).val()); });
      $("input:checkbox[name=camera_usage]:checked").each(function(){ camera_usage.push($(this).val()); });
      $("input:checkbox[name=camera_fixation]:checked").each(function(){ camera_fixation.push($(this).val()); });
      $("input:checkbox[name=camera_alimentation]:checked").each(function(){ camera_alimentation.push($(this).val()); });
      $("input:checkbox[name=camera_ES]:checked").each(function(){ camera_ES.push($(this).val()); });
      $("input:checkbox[name=eclairage_projecteur]:checked").each(function(){ eclairage_projecteur.push($(this).val()); });
      $("input:checkbox[name=logiciel_utilisation]:checked").each(function(){ logiciel_utilisation.push($(this).val()); });
      $("input:checkbox[name=logiciel_consultation]:checked").each(function(){ logiciel_consultation.push($(this).val()); });
      $("input:checkbox[name=logiciel_consultation_]:checked").each(function(){ logiciel_consultation_.push($(this).val()); });
      $("input:checkbox[name=stockage_resolution]:checked").each(function(){ stockage_resolution.push($(this).val()); });
      $("input:checkbox[name=stockage_imgs]:checked").each(function(){ stockage_imgs.push($(this).val()); });
      $("input:checkbox[name=stockage_compression]:checked").each(function(){ stockage_compression.push($(this).val()); });
      $("input:checkbox[name=stockage_mode_enregistrement]:checked").each(function(){ stockage_mode_enregistrement.push($(this).val()); });
      $("input:checkbox[name=recuperation_data_lien]:checked").each(function(){ recuperation_data_lien.push($(this).val()); });
      $("input:checkbox[name=marque]:checked").each(function(){ marque.push($(this).val()); });
    */

      const cameraTypeInputs = document.querySelectorAll<HTMLInputElement>('input[name=camera_type]:checked');
      cameraTypeInputs.forEach((input) => {
        arr_camera_type.push(input.value);
      });
      formData.append('camera_type', JSON.stringify(arr_camera_type));

      const cameraResolutionInputs = document.querySelectorAll<HTMLInputElement>('input[name=camera_resolution]:checked');
      cameraResolutionInputs.forEach((input) => {
        arr_camera_resolution.push(input.value);
      });
      formData.append('camera_resolution', JSON.stringify(arr_camera_resolution));

      const cameraJournuitInputs = document.querySelectorAll<HTMLInputElement>('input[name=camera_journuit]:checked');
      cameraJournuitInputs.forEach((input) => {
        arr_camera_journuit.push(input.value);
      });
      formData.append('camera_journuit', JSON.stringify(arr_camera_journuit));

      const cameraUtilisationInputs = document.querySelectorAll<HTMLInputElement>('input[name=camera_utilisation]:checked');
      cameraUtilisationInputs.forEach((input) => {
        arr_camera_utilisation.push(input.value);
      });
      formData.append('camera_utilisation', JSON.stringify(arr_camera_utilisation));

      const cameraSansfilInputs = document.querySelectorAll<HTMLInputElement>('input[name=camera_sansfil]:checked');
      cameraSansfilInputs.forEach((input) => {
        arr_camera_sansfil.push(input.value);
      });
      formData.append('camera_sansfil', JSON.stringify(arr_camera_sansfil));

      const cameraObjectifInputs = document.querySelectorAll<HTMLInputElement>('input[name=camera_objectif]:checked');
      cameraObjectifInputs.forEach((input) => {
        arr_camera_objectif.push(input.value);
      });
      formData.append('camera_objectif', JSON.stringify(arr_camera_objectif));

      const cameraAntivandaleInputs = document.querySelectorAll<HTMLInputElement>('input[name=camera_antivandale]:checked');
      cameraAntivandaleInputs.forEach((input) => {
        arr_camera_antivandale.push(input.value);
      });
      formData.append('camera_antivandale', JSON.stringify(arr_camera_antivandale));

      const cameraCompressionVideoInputs = document.querySelectorAll<HTMLInputElement>('input[name=camera_compression_video]:checked');
      cameraCompressionVideoInputs.forEach((input) => {
        arr_camera_compression_video.push(input.value);
      });
      formData.append('camera_compression_video', JSON.stringify(arr_camera_compression_video));

      const cameraUsageInputs = document.querySelectorAll<HTMLInputElement>('input[name=camera_usage]:checked');
      cameraUsageInputs.forEach((input) => {
        arr_camera_usage.push(input.value);
      });
      formData.append('camera_usage', JSON.stringify(arr_camera_usage));

      const cameraFixationInputs = document.querySelectorAll<HTMLInputElement>('input[name=camera_fixation]:checked');
      cameraFixationInputs.forEach((input) => {
        arr_camera_fixation.push(input.value);
      });
      formData.append('camera_fixation', JSON.stringify(arr_camera_fixation));

      const cameraAlimentationInputs = document.querySelectorAll<HTMLInputElement>('input[name=camera_alimentation]:checked');
      cameraAlimentationInputs.forEach((input) => {
        arr_camera_alimentation.push(input.value);
      });
      formData.append('camera_alimentation', JSON.stringify(arr_camera_alimentation));

      const cameraESInputs = document.querySelectorAll<HTMLInputElement>('input[name=camera_ES]:checked');
      cameraESInputs.forEach((input) => {
        arr_camera_ES.push(input.value);
      });
      formData.append('camera_ES', JSON.stringify(arr_camera_ES));

      const eclairageProjecteurInputs = document.querySelectorAll<HTMLInputElement>('input[name=eclairage_projecteur]:checked');
      eclairageProjecteurInputs.forEach((input) => {
        arr_eclairage_projecteur.push(input.value);
      });
      formData.append('eclairage_projecteur', JSON.stringify(arr_eclairage_projecteur));

      const logicielUtilisationInputs = document.querySelectorAll<HTMLInputElement>('input[name=logiciel_utilisation]:checked');
      logicielUtilisationInputs.forEach((input) => {
        arr_logiciel_utilisation.push(input.value);
      });
      formData.append('logiciel_utilisation', JSON.stringify(arr_logiciel_utilisation));

      const logicielConsultationInputs = document.querySelectorAll<HTMLInputElement>('input[name=logiciel_consultation]:checked');
      logicielConsultationInputs.forEach((input) => {
        arr_logiciel_consultation.push(input.value);
      });
      formData.append('logiciel_consultation', JSON.stringify(arr_logiciel_consultation));

      const logicielConsultationInputs_ = document.querySelectorAll<HTMLInputElement>('input[name=logiciel_consultation_]:checked');
      logicielConsultationInputs_.forEach((input) => {
        arr_logiciel_consultation_.push(input.value);
      });
      formData.append('logiciel_consultation_', JSON.stringify(arr_logiciel_consultation_));

      const stockageResolutionInputs = document.querySelectorAll<HTMLInputElement>('input[name=stockage_resolution]:checked');
      stockageResolutionInputs.forEach((input) => {
        arr_stockage_resolution.push(input.value);
      });
      formData.append('stockage_resolution', JSON.stringify(arr_stockage_resolution));

      const stockageImgsInputs = document.querySelectorAll<HTMLInputElement>('input[name=stockage_imgs]:checked');
      stockageImgsInputs.forEach((input) => {
        arr_stockage_imgs.push(input.value);
      });
      formData.append('stockage_imgs', JSON.stringify(arr_stockage_imgs));

      const stockageCompressionInputs = document.querySelectorAll<HTMLInputElement>('input[name=stockage_compression]:checked');
      stockageCompressionInputs.forEach((input) => {
        arr_stockage_compression.push(input.value);
      });
      formData.append('stockage_compression', JSON.stringify(arr_stockage_compression));

      const stockageModeEnregistrementInputs = document.querySelectorAll<HTMLInputElement>('input[name=stockage_mode_enregistrement]:checked');
      stockageModeEnregistrementInputs.forEach((input) => {
        arr_stockage_mode_enregistrement.push(input.value);
      });
      formData.append('stockage_mode_enregistrement', JSON.stringify(arr_stockage_mode_enregistrement));
      const recuperationDataLienInputs = document.querySelectorAll<HTMLInputElement>('input[name=recuperation_data_lien]:checked');
      recuperationDataLienInputs.forEach((input) => {
        arr_recuperation_data_lien.push(input.value);
      });
      formData.append('recuperation_data_lien', JSON.stringify(arr_recuperation_data_lien));

      const marqueInputs = document.querySelectorAll<HTMLInputElement>('input[name=marque]:checked');
      marqueInputs.forEach((input) => {
        arr_marque.push(input.value);
      });
      formData.append('marque', JSON.stringify(arr_marque));

    // add array types to formData
    /* $("input:checkbox[name=camera_type]:checked").each(function(){ arr_camera_type.push($(this).val()); });
    formData.append("camera_type", JSON.stringify(arr_camera_type));
    $("input:checkbox[name=camera_resolution]:checked").each(function(){ arr_camera_resolution.push($(this).val()); });
    formData.append("camera_resolution", JSON.stringify(arr_camera_resolution));
    $("input:checkbox[name=camera_journuit]:checked").each(function(){ arr_camera_journuit.push($(this).val()); });
    formData.append("camera_journuit", JSON.stringify(arr_camera_journuit));
    $("input:checkbox[name=camera_utilisation]:checked").each(function(){ arr_camera_utilisation.push($(this).val()); });
    formData.append("camera_utilisation", JSON.stringify(arr_camera_utilisation));
    $("input:checkbox[name=camera_sansfil]:checked").each(function(){ arr_camera_sansfil.push($(this).val()); });
    formData.append("camera_sansfil", JSON.stringify(arr_camera_sansfil));
    $("input:checkbox[name=camera_objectif]:checked").each(function(){ arr_camera_objectif.push($(this).val()); });
    formData.append("camera_objectif", JSON.stringify(arr_camera_objectif));
    $("input:checkbox[name=camera_antivandale]:checked").each(function(){ arr_camera_antivandale.push($(this).val()); });
    formData.append("camera_antivandale", JSON.stringify(arr_camera_antivandale));
    $("input:checkbox[name=camera_compression_video]:checked").each(function(){ arr_camera_compression_video.push($(this).val()); });
    formData.append("camera_compression_video", JSON.stringify(arr_camera_compression_video));
    $("input:checkbox[name=camera_usage]:checked").each(function(){ arr_camera_usage.push($(this).val()); });
    formData.append("camera_usage", JSON.stringify(arr_camera_usage));
    $("input:checkbox[name=camera_fixation]:checked").each(function(){ arr_camera_fixation.push($(this).val()); });
    formData.append("camera_fixation", JSON.stringify(arr_camera_fixation));
    $("input:checkbox[name=camera_alimentation]:checked").each(function(){ arr_camera_alimentation.push($(this).val()); });
    formData.append("camera_alimentation", JSON.stringify(arr_camera_alimentation));
    $("input:checkbox[name=camera_ES]:checked").each(function(){ arr_camera_ES.push($(this).val()); });
    formData.append("camera_ES", JSON.stringify(arr_camera_ES));
    $("input:checkbox[name=eclairage_projecteur]:checked").each(function(){ arr_eclairage_projecteur.push($(this).val()); });
    formData.append("eclairage_projecteur", JSON.stringify(arr_eclairage_projecteur));
    $("input:checkbox[name=logiciel_utilisation]:checked").each(function(){ arr_logiciel_utilisation.push($(this).val()); });
    formData.append("logiciel_utilisation", JSON.stringify(arr_logiciel_utilisation));
    $("input:checkbox[name=logiciel_consultation]:checked").each(function(){ arr_logiciel_consultation.push($(this).val()); });
    formData.append("logiciel_consultation", JSON.stringify(arr_logiciel_consultation));
    $("input:checkbox[name=logiciel_consultation_]:checked").each(function(){ arr_logiciel_consultation_.push($(this).val()); });
    formData.append("logiciel_consultation_", JSON.stringify(arr_logiciel_consultation_));
    $("input:checkbox[name=stockage_resolution]:checked").each(function(){ arr_stockage_resolution.push($(this).val()); });
    formData.append("stockage_resolution", JSON.stringify(arr_stockage_resolution));
    $("input:checkbox[name=stockage_imgs]:checked").each(function(){ arr_stockage_imgs.push($(this).val()); });
    formData.append("stockage_imgs", JSON.stringify(arr_stockage_imgs));
    $("input:checkbox[name=stockage_compression]:checked").each(function(){ arr_stockage_compression.push($(this).val()); });
    formData.append("stockage_compression", JSON.stringify(arr_stockage_compression));
    $("input:checkbox[name=stockage_mode_enregistrement]:checked").each(function(){ arr_stockage_mode_enregistrement.push($(this).val()); });
    formData.append("stockage_mode_enregistrement", JSON.stringify(arr_stockage_mode_enregistrement));
    $("input:checkbox[name=recuperation_data_lien]:checked").each(function(){ arr_recuperation_data_lien.push($(this).val()); });
    formData.append("recuperation_data_lien", JSON.stringify(arr_recuperation_data_lien));
    $("input:checkbox[name=marque]:checked").each(function(){ arr_marque.push($(this).val()); });
    formData.append("marque", JSON.stringify(arr_marque)); */








    // add string types to formData
    formData.append("nombre_cameras", this.nombre_cameras);
    formData.append("textfield", this.textfield);
    formData.append("textfield2", this.textfield2);
    formData.append("logiciel_OS", this.logiciel_OS);
    formData.append("visualisation_resolution", this.visualisation_resolution);
    formData.append("nb_img_par_seconde", this.nb_img_par_seconde);
    formData.append("compression", this.compression);
    formData.append("logiciel_bandepassantelien", this.logiciel_bandepassantelien);
    formData.append("stockage_duree_enregistrement", this.stockage_duree_enregistrement);
    formData.append("recuperation_data_bandepassante", this.recuperation_data_bandepassante);
    formData.append("recuperation_data_distance", this.recuperation_data_distance);
    formData.append("description_projet", this.description_projet);
    formData.append("societe", this.videoSurveillanceForm.value.societe);
    formData.append("clientID", this.videoSurveillanceForm.value.clientID);
    formData.append("nom", this.videoSurveillanceForm.value.nom);
    formData.append("fonction", this.videoSurveillanceForm.value.fonction);
    formData.append("email", this.videoSurveillanceForm.value.email);
    formData.append("telephone", this.videoSurveillanceForm.value.telephone);
    formData.append("files", this.fileToUpload);




    this.formError = false;
    this.sendError = false;
      if (this.videoSurveillanceForm.valid) {
        this.http.post<any>(
          `${environment.apiUrl}/envoiPriseBesoinVideo.php`,
          formData,
          {
            withCredentials: true
          }
        )
        .pipe(take(1))
        .subscribe(
          (ret) =>
          {

            this.router.navigate(['videosurveillance-confirmation']);
          },
          (err) =>
          {
          }
        );
      }

    return (false);
  }

  handleFileInput(files: FileList) {

    this.fileToUpload = files.item(0);
  }

}
