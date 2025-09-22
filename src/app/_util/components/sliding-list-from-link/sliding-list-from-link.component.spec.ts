import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidingListFromLinkComponent } from './sliding-list-from-link.component';

describe('SlidingListFromLinkComponent', () => {
  let component: SlidingListFromLinkComponent;
  let fixture: ComponentFixture<SlidingListFromLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlidingListFromLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidingListFromLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
