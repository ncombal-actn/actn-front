import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PdfIconComponent } from './pdf-icon.component';

describe('PdfIconComponent', () => {
  let component: PdfIconComponent;
  let fixture: ComponentFixture<PdfIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
