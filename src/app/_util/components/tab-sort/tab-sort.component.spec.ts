import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TabSortComponent } from './tab-sort.component';

describe('TabSortComponent', () => {
  let component: TabSortComponent;
  let fixture: ComponentFixture<TabSortComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TabSortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
