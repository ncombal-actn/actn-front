import { Component, OnInit } from '@angular/core';
import { WindowService } from '@core/_services';
import { environment } from '@env';
import {TitleWLineComponent} from "@/_util/components/title-w-line/title-w-line.component";

@Component({
  selector: 'app-conditions-sav',
  standalone: true,
  imports: [
    TitleWLineComponent
  ],
  templateUrl: './conditions-sav.component.html',
  styleUrls: ['./conditions-sav.component.scss']
})
export class ConditionsSavComponent implements OnInit {

  environment = environment;

  constructor(
    private windowService: WindowService
  ) { }

  ngOnInit() {
  }

  historyBack() {
    this.windowService.nativeWindow.history.back();
  }

}
