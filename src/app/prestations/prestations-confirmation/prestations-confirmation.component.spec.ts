import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestationsConfirmationComponent } from './prestations-confirmation.component';

describe('PrestationsConfirmationComponent', () => {
  let component: PrestationsConfirmationComponent;
  let fixture: ComponentFixture<PrestationsConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrestationsConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestationsConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
