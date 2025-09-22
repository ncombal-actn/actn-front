import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FinRetourComponent } from './fin-retour.component';

describe('FinRetourComponent', () => {
  let component: FinRetourComponent;
  let fixture: ComponentFixture<FinRetourComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FinRetourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinRetourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
