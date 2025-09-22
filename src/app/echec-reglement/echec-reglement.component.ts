import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LicenceService, TempCartService } from '@core/_services';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-echec-reglement',
  templateUrl: './echec-reglement.component.html',
  styleUrls: ['./echec-reglement.component.scss']
})
export class EchecReglementComponent implements OnInit
{


  ncmd = 0;
  code = null;
  msg1: string = null;
  msg2: string = null;
  type: '' | 'DEV' | 'CMD' | 'LOC' = '';

  constructor(
    private route: ActivatedRoute,
    public licenceService: LicenceService
  )
  {
    this.route.queryParams
    .pipe(take(1))
    .subscribe(
      (params) =>
      {

        if (params['ncde']) {
          this.ncmd = params['ncde'];
        }
        if (params['code']) {
          this.code = params['code'];
        }
        if (params['msg1']) {
          this.msg1 = params['msg1'];
        }
        if (params['msg2']) {
          this.msg2 = params['msg2'];
        }
        if (params['type']) {
          this.type = params['type'];
        }
      }
    );
  }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

}
