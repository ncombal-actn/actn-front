import { Component, OnInit, Input } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})

export class StepperComponent implements OnInit {

  @Input() step = 1;

  page: string;

  constructor(
    protected route: ActivatedRoute) { }

  ngOnInit(): void {
    this.page =  decodeURIComponent(this.route.snapshot.url[this.route.snapshot.url.length - 1]?.path ?? '');
  }
}
