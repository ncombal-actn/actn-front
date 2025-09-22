import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddToCartFormComponent } from './add-to-cart-form.component';

describe('AddToCartButtonComponent', () => {
  let component: AddToCartFormComponent;
  let fixture: ComponentFixture<AddToCartFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddToCartFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToCartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
