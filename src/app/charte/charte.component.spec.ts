import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CharteComponent } from './charte.component';

describe('CharteComponent', () => {
  let component: CharteComponent;
  let fixture: ComponentFixture<CharteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CharteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
