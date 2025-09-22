import { Component, OnInit } from '@angular/core';
import { WindowService } from '@core/_services';
import { environment } from '@env';

@Component({
  selector: 'app-conditions-sav',
  templateUrl: './conditions-sav.component.html',
  styleUrls: ['./conditions-sav.component.scss']
})
export class ConditionsSavComponent implements OnInit {

  environment = environment;

  constructor(
    private window: WindowService
  ) { }

  ngOnInit() {
  }

  historyBack() {
    this.window.history.back();
  }

}
