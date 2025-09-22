import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snackbar',
  template: `
    <div class="snackbar-content">
      <span class="message-text" [innerHTML]="data.message"></span>
      <button mat-button class="close-button" (click)="closeSnackbar()">OK</button>
    </div>
  `,
  styles: [`
    .snackbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 10px; /* Plus de padding pour aérer la snackbar */
      box-sizing: border-box;
      background-color: #d32f2f; /* Rouge profond */
      color: white; /* Contraste élevé */
      border-radius: 12px; /* Coins arrondis plus marqués */
     
    }
    .message-text {
      
      font-weight: 500; /* Poids moyen pour une bonne lisibilité */
      line-height: 1.5; /* Espacement des lignes pour plus de clarté */
      margin-right: 16px; /* Espacement entre le texte et le bouton */
    }
    .close-button {
      color: #d32f2f; /* Couleur rouge pour correspondre au thème */
      font-weight: bold; /* Texte en gras */
      background-color: white; /* Fond contrasté */
      border: 1px solid white; /* Bordure subtile */
      border-radius: 8px; /* Coins arrondis */
      padding: 10px 16px; /* Plus de padding pour un bouton plus grand */
      text-transform: uppercase; /* Texte en majuscules pour insister sur l'urgence */
      transition: background-color 0.3s, color 0.3s; /* Effet de transition fluide */
    }
    .close-button:hover {
      background-color: rgba(255, 255, 255, 0.3); /* Effet survol subtil */
      color: white; /* Texte toujours visible */
    }
    a {
      color: white;
      text-decoration: underline;
    }
    ::ng-deep .mat-mdc-snack-bar-container .mat-mdc-snackbar-surface {
      background-color: #d32f2f !important; /* Override de fond rouge */
      color: white !important; /* Texte en blanc pour un contraste élevé */
      min-height: 80px; /* Augmente la hauteur minimale de la snackbar */
    }
  `]
})
export class CustomSnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private snackBarRef: MatSnackBarRef<CustomSnackbarComponent>
  ) {}

  closeSnackbar() {
    this.snackBarRef.dismiss();
  }
}
