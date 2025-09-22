import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdrComponent } from './cdr.component';

describe('CdrComponent', () => {
  let component: CdrComponent;
  let fixture: ComponentFixture<CdrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CdrComponent]
    });
    fixture = TestBed.createComponent(CdrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
