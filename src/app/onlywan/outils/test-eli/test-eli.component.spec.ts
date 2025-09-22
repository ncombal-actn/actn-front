import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEliComponent } from './test-eli.component';

describe('TestEliComponent', () => {
  let component: TestEliComponent;
  let fixture: ComponentFixture<TestEliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestEliComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestEliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
