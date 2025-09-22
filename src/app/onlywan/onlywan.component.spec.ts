import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlywanComponent } from './onlywan.component';

describe('OnlywanComponent', () => {
  let component: OnlywanComponent;
  let fixture: ComponentFixture<OnlywanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlywanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlywanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
