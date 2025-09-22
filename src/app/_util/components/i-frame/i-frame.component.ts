import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '@core/_services/storage.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-i-frame',
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
