import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SuiviRetourComponent } from './suivi-retour.component';

describe('SuiviRetourComponent', () => {
  let component: SuiviRetourComponent;
  let fixture: ComponentFixture<SuiviRetourComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SuiviRetourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviRetourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
