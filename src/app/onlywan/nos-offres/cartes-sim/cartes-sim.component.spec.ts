import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartesSimComponent } from './cartes-sim.component';

describe('CartesSimComponent', () => {
  let component: CartesSimComponent;
  let fixture: ComponentFixture<CartesSimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartesSimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartesSimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
