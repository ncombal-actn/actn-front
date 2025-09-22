import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeartbeatSensorComponent } from './heartbeat-sensor.component';

describe('HeartbeatSensorComponent', () => {
  let component: HeartbeatSensorComponent;
  let fixture: ComponentFixture<HeartbeatSensorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HeartbeatSensorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeartbeatSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
