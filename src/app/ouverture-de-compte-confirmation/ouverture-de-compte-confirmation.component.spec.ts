import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OuvertureDeCompteConfirmationComponent } from './ouverture-de-compte-confirmation.component';

describe('OuvertureDeCompteConfirmationComponent', () => {
  let component: OuvertureDeCompteConfirmationComponent;
  let fixture: ComponentFixture<OuvertureDeCompteConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OuvertureDeCompteConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OuvertureDeCompteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
