import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SystemeAideChoixComponent } from './systeme-aide-choix.component';

describe('SystemeAideChoixComponent', () => {
  let component: SystemeAideChoixComponent;
  let fixture: ComponentFixture<SystemeAideChoixComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemeAideChoixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemeAideChoixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
