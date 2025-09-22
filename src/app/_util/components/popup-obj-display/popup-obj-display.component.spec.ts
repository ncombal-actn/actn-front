import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PopupObjDisplayComponent } from './popup-obj-display.component';

describe('PopupObjDisplayComponent', () => {
  let component: PopupObjDisplayComponent;
  let fixture: ComponentFixture<PopupObjDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupObjDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupObjDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
