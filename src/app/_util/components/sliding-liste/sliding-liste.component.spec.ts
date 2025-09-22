import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SlidingListeComponent } from './sliding-liste.component';

describe('SlidingListeComponent', () => {
  let component: SlidingListeComponent;
  let fixture: ComponentFixture<SlidingListeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidingListeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidingListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
