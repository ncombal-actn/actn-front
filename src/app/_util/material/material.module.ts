import { NgModule } from '@angular/core';

import { MatButtonModule as MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule as MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule as MatInputModule } from '@angular/material/input';
import { MatListModule as MatListModule } from '@angular/material/list';
import { MatSelectModule as MatSelectModule } from '@angular/material/select';
import { MatRadioModule as MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule as MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule as MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule as MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule as MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntl as MatPaginatorIntl } from '@angular/material/paginator';
import { MatSlideToggleModule as MatSlideToggleModule } from '@angular/material/slide-toggle';
import { getFrenchPaginatorIntl } from '../paginator/french-paginator-intl';
import { MatChipsModule as MatChipsModule } from '@angular/material/chips';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatProgressBarModule as MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
  ],
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatRippleModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatChipsModule,
    MatSlideToggleModule,
    ScrollingModule,
    MatProgressBarModule,
   // ScrollToModule.forRoot()
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatRippleModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTooltipModule,
    MatSlideToggleModule,
   // ScrollToModule,
    MatPaginatorModule,
    MatChipsModule,
    MatProgressBarModule,
    ScrollingModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getFrenchPaginatorIntl() }
  ]
})
export class MaterialModule { }
