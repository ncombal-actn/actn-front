import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ValidationPanierComponent } from './validation-panier.component';

describe('ValidationPanierComponent', () => {
  let component: ValidationPanierComponent;
  let fixture: ComponentFixture<ValidationPanierComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationPanierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationPanierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
