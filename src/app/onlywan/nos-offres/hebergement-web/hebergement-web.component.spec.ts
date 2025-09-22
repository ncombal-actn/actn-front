import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HebergementWebComponent } from './hebergement-web.component';

describe('HebergementWebComponent', () => {
  let component: HebergementWebComponent;
  let fixture: ComponentFixture<HebergementWebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HebergementWebComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HebergementWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
