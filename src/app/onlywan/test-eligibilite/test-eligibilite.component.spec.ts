import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEligibiliteComponent } from './test-eligibilite.component';

describe('TestEligibiliteComponent', () => {
  let component: TestEligibiliteComponent;
  let fixture: ComponentFixture<TestEligibiliteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestEligibiliteComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestEligibiliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
