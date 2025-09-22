import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireProjetVideosurveillanceComponent } from './formulaire-projet-videosurveillance.component';

describe('FormulaireProjetVideosurveillanceComponent', () => {
  let component: FormulaireProjetVideosurveillanceComponent;
  let fixture: ComponentFixture<FormulaireProjetVideosurveillanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaireProjetVideosurveillanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaireProjetVideosurveillanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
