import { Component, Inject, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-horizon-delais',
  standalone: true,
  templateUrl: './horizon-delais.component.html',
  styleUrls: ['./horizon-delais.component.scss'],
})
export class HorizonDelaisComponent  {
  @Input() produit:[string,string]

  environment = environment;
  constructor(public http: HttpClient,
    public dialog: MatDialog) { }

    getHorizonDelais(){
      return this.http.get(`${environment.apiUrl}/horizonDelais.php`,{
        params: {
          produit: this.produit[0],
          marque: this.produit[1]
        }
      }).subscribe((data) => {
        this.openDialog(data);


      });
    }
    openDialog(data): void {
      const dialogRef = this.dialog.open(DialogContentComponent, {
        width: '400px',
        data: data
      });


    }
}


@Component({
  selector: 'dialog-content',
  template: `
    <h1 mat-dialog-title>Prochaine date de livraison</h1>
    <div mat-dialog-content>
      <ng-container *ngIf="data">
        <div class="item">

          <h2><span class="date">Date</span> <span class="quantite">Quantités</span></h2>
        </div>
        <div *ngFor="let item of data" class="item">
          <h2><span class="date">{{item.date}}</span> <span class="quantite">{{item.quantite}}</span></h2>
          <mat-divider></mat-divider>
        </div>
      </ng-container>
    </div>
    <div mat-dialog-actions class="actions">
      <button class="raised-button" mat-button mat-dialog-close>Fermer</button>
    </div>
  `,
  styles: [`
    .actions {
      display: flex;
      justify-content: flex-end;
    }
    h1 {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
      text-align: center;
    }
    .item {
      margin-bottom: 15px;
    }
    .item h2 {
      font-size: 18px;
      margin: 0;
      display: flex;
      justify-content: space-between;
    }
    .date {
      flex: 1;
      text-align: left;
    }
    .quantite {
      flex: 1;
      text-align: right;
    }
    mat-divider {
      margin: 10px 0;
    }
    mat-dialog-actions {
      display: flex;
      justify-content: flex-end;
    }
    button {
      background-color: #9b0037;
      color: white !important;
      padding: 10px 20px;
      font-weight: bold;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    button:hover {
      background-color:rgb(143, 2, 52);
    }
  `]
})
export class DialogContentComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
