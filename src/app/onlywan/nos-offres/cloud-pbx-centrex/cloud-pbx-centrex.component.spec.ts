import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudPbxCentrexComponent } from './cloud-pbx-centrex.component';

describe('CloudPbxCentrexComponent', () => {
  let component: CloudPbxCentrexComponent;
  let fixture: ComponentFixture<CloudPbxCentrexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloudPbxCentrexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudPbxCentrexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
