import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LabelsPanierComponent } from './labels-panier.component';

describe('LabelsPanierComponent', () => {
  let component: LabelsPanierComponent;
  let fixture: ComponentFixture<LabelsPanierComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelsPanierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelsPanierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
