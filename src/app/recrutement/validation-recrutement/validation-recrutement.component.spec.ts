import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationRecrutementComponent } from './validation-recrutement.component';

describe('ValidationRecrutementComponent', () => {
  let component: ValidationRecrutementComponent;
  let fixture: ComponentFixture<ValidationRecrutementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationRecrutementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationRecrutementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
