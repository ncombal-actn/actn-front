import { Component, OnInit } from '@angular/core';
import { SnackbarService } from './snackbar.service';
import {faTimes} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {

  constructor(
    public snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {}

  protected readonly faTimes = faTimes;
}
