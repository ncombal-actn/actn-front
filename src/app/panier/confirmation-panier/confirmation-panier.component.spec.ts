import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmationPanierComponent } from './confirmation-panier.component';

describe('ConfirmationPanierComponent', () => {
  let component: ConfirmationPanierComponent;
  let fixture: ComponentFixture<ConfirmationPanierComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationPanierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationPanierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
