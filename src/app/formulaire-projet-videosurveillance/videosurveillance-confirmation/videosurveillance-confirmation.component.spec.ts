import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosurveillanceConfirmationComponent } from './videosurveillance-confirmation.component';

describe('VideosurveillanceConfirmationComponent', () => {
  let component: VideosurveillanceConfirmationComponent;
  let fixture: ComponentFixture<VideosurveillanceConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideosurveillanceConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideosurveillanceConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
