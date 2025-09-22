import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HikAxProComponent } from './hik-ax-pro.component';

describe('HikAxProComponent', () => {
  let component: HikAxProComponent;
  let fixture: ComponentFixture<HikAxProComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HikAxProComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HikAxProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
