import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComparateurComponent } from './comparateur.component';

describe('ComparateurComponent', () => {
  let component: ComparateurComponent;
  let fixture: ComponentFixture<ComparateurComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparateurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
