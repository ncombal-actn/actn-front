import { Component, OnInit } from '@angular/core';
import { InputNumberComponent as BaseInputNumberComponent } from '@/_util/components/input-number/input-number.component';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
	selector: 'conf-input-number',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
	templateUrl: '../../../_util/components/input-number/input-number.component.html',
	styleUrls: ['./input-number.component.scss']
})
export class InputNumberComponent extends BaseInputNumberComponent implements OnInit {

	constructor() {
		super();
		this.size = 'small';
		this._number = 0;
	}

	ngOnInit(): void { }

}
