import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EspaceClientComponent } from './espace-client.component';

describe('EspaceClientComponent', () => {
  let component: EspaceClientComponent;
  let fixture: ComponentFixture<EspaceClientComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EspaceClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EspaceClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
