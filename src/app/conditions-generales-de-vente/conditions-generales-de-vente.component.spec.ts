import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConditionsGeneralesDeVenteComponent } from './conditions-generales-de-vente.component';

describe('ConditionsGeneralesDeVenteComponent', () => {
  let component: ConditionsGeneralesDeVenteComponent;
  let fixture: ComponentFixture<ConditionsGeneralesDeVenteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionsGeneralesDeVenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionsGeneralesDeVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
