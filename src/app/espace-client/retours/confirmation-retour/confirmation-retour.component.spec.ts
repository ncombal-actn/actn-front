import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmationRetourComponent } from './confirmation-retour.component';

describe('ConfirmationRetourComponent', () => {
  let component: ConfirmationRetourComponent;
  let fixture: ComponentFixture<ConfirmationRetourComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationRetourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationRetourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
