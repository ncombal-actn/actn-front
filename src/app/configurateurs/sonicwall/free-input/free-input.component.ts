import { Component } from '@angular/core';
import { FreeInputComponent as BaseFreeInputComponent } from '@/configurateurs/zyxel/free-input/free-input.component';
import { ConfigurateurService } from '@/configurateurs/configurateur.service';

@Component({
  selector: 'conf-free-input',
  templateUrl: '../../zyxel/free-input/free-input.component.html',
  styleUrls: ['./free-input.component.scss']
})
export class FreeInputComponent extends BaseFreeInputComponent {

  constructor(
    public configService: ConfigurateurService
  ) {
    super(configService);
  }

}
