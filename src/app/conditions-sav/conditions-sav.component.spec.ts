import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConditionsSavComponent } from './conditions-sav.component';

describe('ConditionsSavComponent', () => {
  let component: ConditionsSavComponent;
  let fixture: ComponentFixture<ConditionsSavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionsSavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionsSavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
