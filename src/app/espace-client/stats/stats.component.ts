import {Component, OnInit} from '@angular/core';
import {AdresseService, AuthenticationService} from '@core/_services';
import {Adresse} from "@/_util/models";
import {ConfirmAddressComponent} from "@/espace-client/stats/confirm-address/confirm-address.component";
import {MatDialog} from "@angular/material/dialog";
import {RouterLink} from "@angular/router";
import {MatIcon} from "@angular/material/icon";


@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [
    RouterLink,
    MatIcon
  ],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})

export class StatsComponent implements OnInit {
  addrData: Adresse[] = [];

  constructor(
    public authService: AuthenticationService,
    public adresseService: AdresseService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.getAdresses();
  }

  getAdresses(){
    this.adresseService.getAddress().subscribe((data) => {
      this.addrData = data;
    });
  }

  changeDefaultAddress(codeadresse, nom, adresse1, adresse2, codepostal, ville, phone, pays){
    const dialogRef = this.dialog.open(ConfirmAddressComponent, {
      width: '30%',
      data: { message: `Voulez-vous vraiment mettre par défaut l'adresse ${nom} ?`, isDefault: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adresseService.changeDefaultAddress(codeadresse, nom, adresse1, adresse2, codepostal, ville, phone, pays).subscribe(() => {
          this.getAdresses();
        });
      }
    });
  }

  deleteAdresse(code: string, nom: string) {
    const dialogRef = this.dialog.open(ConfirmAddressComponent, {
      width: '30%',
      data: { message: `Voulez-vous vraiment supprimer l'adresse ${nom} ?`, isDefault: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adresseService.deleteAddress(code, nom).subscribe(() => {
          this.getAdresses();
        });
      }
    });
  }
}

