import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RetoursComponent } from './retours.component';

describe('RetoursComponent', () => {
  let component: RetoursComponent;
  let fixture: ComponentFixture<RetoursComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RetoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
