import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '@core/_services/storage.service';
import { Observable } from 'rxjs';
import {SafePipe} from "@/_util/components/youtube/youtube.component";

@Component({
  selector: 'app-i-frame',
  standalone: true,
  imports: [
    SafePipe
  ],
  templateUrl: './i-frame.component.html',
  styleUrls: ['./i-frame.component.scss']
})
export class IFrameComponent implements OnInit {

  htmlString: string;

  constructor(
    private storageService: StorageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.storageService.getStoredData('carousel', 'link', () => new Observable<string>()).subscribe(link => {
      if (link === ''){
        this.router.navigate(['/']);
      } else {
        this.htmlString = link;
      }
    });
  }

}
