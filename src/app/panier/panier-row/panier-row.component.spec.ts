import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PanierRowComponent } from './panier-row.component';

describe('PanierRowComponent', () => {
  let component: PanierRowComponent;
  let fixture: ComponentFixture<PanierRowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PanierRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanierRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
