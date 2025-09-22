import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReglementSuccesComponent } from './reglement-succes.component';

describe('ReglementSuccesComponent', () => {
  let component: ReglementSuccesComponent;
  let fixture: ComponentFixture<ReglementSuccesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReglementSuccesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglementSuccesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
