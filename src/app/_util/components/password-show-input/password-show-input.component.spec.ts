import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PasswordShowInputComponent } from './password-show-input.component';

describe('PasswordShowInputComponent', () => {
  let component: PasswordShowInputComponent;
  let fixture: ComponentFixture<PasswordShowInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordShowInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordShowInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
