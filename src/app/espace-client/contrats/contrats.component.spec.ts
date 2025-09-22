import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContratsComponent } from './contrats.component';

describe('ContratsComponent', () => {
  let component: ContratsComponent;
  let fixture: ComponentFixture<ContratsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContratsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
