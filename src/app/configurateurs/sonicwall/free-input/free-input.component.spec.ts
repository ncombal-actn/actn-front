import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeInputComponent } from './free-input.component';

describe('FreeInputComponent', () => {
  let component: FreeInputComponent;
  let fixture: ComponentFixture<FreeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
