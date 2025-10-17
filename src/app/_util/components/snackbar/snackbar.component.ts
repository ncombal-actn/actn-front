import { Component, OnInit } from '@angular/core';
import { SnackbarService } from './snackbar.service';
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {NgClass} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [
    NgClass,
    FaIconComponent
  ],
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
