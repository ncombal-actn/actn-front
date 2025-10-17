import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { environment } from "@env";
import {ImgFallbackDirective} from "@/_util/directives/img-fallback.directive";
import {NgClass} from "@angular/common";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-sav-popup',
  standalone: true,
  imports: [
    ImgFallbackDirective,
    MatDialogTitle,
    MatDialogContent,
    NgClass,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './sav-popup.component.html',
  styleUrl: './sav-popup.component.scss'
})
export class SavPopupComponent {
  environment = environment;
  constructor(
    public dialogRef: MatDialogRef<SavPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {


  }

  onClose(): void {
    this.dialogRef.close();
  }
}
