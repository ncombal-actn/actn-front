import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAddToCartComponent } from './new-add-to-cart.component';

describe('NewAddToCartComponent', () => {
  let component: NewAddToCartComponent;
  let fixture: ComponentFixture<NewAddToCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewAddToCartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAddToCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
