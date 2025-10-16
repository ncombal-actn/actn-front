import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {WindowService} from "@core/_services";
import {TitleWLineComponent} from "@/_util/components/title-w-line/title-w-line.component";

@Component({
  selector: 'app-test-eli',
  standalone: true,
  imports: [
    TitleWLineComponent
  ],
  templateUrl: './test-eli.component.html',
  styleUrls: ['./test-eli.component.scss']
})
export class TestEliComponent implements AfterViewInit {

  @ViewChild('testEligibilite') iframe: ElementRef;

  constructor(private windowService: WindowService){}

  ngAfterViewInit() {
    this.windowService.tonPereLeGigolo(this.receiveMessage);
  }

  receiveMessage = (event) => {
    if (event.data && event.data.h) {
      this.iframe.nativeElement.height = event.data.h;
    }
  }

}
