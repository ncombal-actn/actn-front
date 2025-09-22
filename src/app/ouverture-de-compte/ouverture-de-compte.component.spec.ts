import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OuvertureDeCompteComponent } from './ouverture-de-compte.component';

describe('OuvertureDeCompteComponent', () => {
  let component: OuvertureDeCompteComponent;
  let fixture: ComponentFixture<OuvertureDeCompteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OuvertureDeCompteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OuvertureDeCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
