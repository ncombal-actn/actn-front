import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ObjDisplayComponent } from './obj-display.component';

describe('ObjDisplayComponent', () => {
  let component: ObjDisplayComponent;
  let fixture: ComponentFixture<ObjDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
