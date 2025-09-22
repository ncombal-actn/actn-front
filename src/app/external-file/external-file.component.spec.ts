import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExternalFileComponent } from './external-file.component';

describe('ExternalFileComponent', () => {
  let component: ExternalFileComponent;
  let fixture: ComponentFixture<ExternalFileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
