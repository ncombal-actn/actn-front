import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestARCEPComponent } from './test-arcep.component';

describe('TestARCEPComponent', () => {
  let component: TestARCEPComponent;
  let fixture: ComponentFixture<TestARCEPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestARCEPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestARCEPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
