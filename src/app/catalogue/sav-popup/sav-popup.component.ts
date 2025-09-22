import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from "@env";

@Component({
  selector: 'app-sav-popup',
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
