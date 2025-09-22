import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavPopupComponent } from './sav-popup.component';

describe('SavPopupComponent', () => {
  let component: SavPopupComponent;
  let fixture: ComponentFixture<SavPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SavPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
