import { Adresse } from '@/_util/models';
import { EventEmitter, Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { RmaService } from '@core/_services/rma.service';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-change-adresse',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './change-adresse.component.html',
  styleUrls: ['./change-adresse.component.scss']
})
export class ChangeAdresseComponent implements OnInit {

  @Input()
  get bool(): boolean {
    return this._bool;
  }
  set bool(bool: boolean) {
    this._bool = bool;
    this.isPopUp.emit(this._bool);
  }

  @Output() isPopUp = new EventEmitter<boolean>();

  @Output() adresseSortie = new EventEmitter<Adresse>();

  private _bool = false;
  selectedAdress: Adresse = null;
  listAdresse;

  constructor(
    private rmaService: RmaService,
  ) { }

  ngOnInit(): void {
    this.chargerAdresse();
  }

  close() {
    this.bool = false;
  }


  emitAdresse() {
    this.adresseSortie.emit(this.selectedAdress);
    this.close();
  }

  chargerAdresse() {
    this.rmaService.chargerAdresse().subscribe(
      data => {
        const princip = data;
        this.listAdresse = princip.filter(adresse => adresse.defaut === 'P');
        data.forEach(element => {
          if (element.defaut !== 'P'){
            this.listAdresse.push(element);
          }
        });
      }
    );
  }

}
