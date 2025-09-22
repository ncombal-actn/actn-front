import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DematerialisationComponent } from './dematerialisation.component';

describe('DematerialisationComponent', () => {
  let component: DematerialisationComponent;
  let fixture: ComponentFixture<DematerialisationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DematerialisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DematerialisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
