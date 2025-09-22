import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-address',
  templateUrl: './confirm-address.component.html',
  styleUrl: './confirm-address.component.scss'
})
export class ConfirmAddressComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string, isDefault: boolean }
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
