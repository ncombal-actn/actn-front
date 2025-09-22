import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchecReglementComponent } from './echec-reglement.component';

describe('EchecReglementComponent', () => {
  let component: EchecReglementComponent;
  let fixture: ComponentFixture<EchecReglementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EchecReglementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EchecReglementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
