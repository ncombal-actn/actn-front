import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GrilleTransportComponent } from './grille-transport.component';

describe('GrilleTransportComponent', () => {
  let component: GrilleTransportComponent;
  let fixture: ComponentFixture<GrilleTransportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GrilleTransportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrilleTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
