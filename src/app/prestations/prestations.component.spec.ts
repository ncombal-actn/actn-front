import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrestationsComponent } from './prestations.component';

describe('PrestationsComponent', () => {
  let component: PrestationsComponent;
  let fixture: ComponentFixture<PrestationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrestationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
