import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SipTrunkComponent } from './sip-trunk.component';

describe('SipTrunkComponent', () => {
  let component: SipTrunkComponent;
  let fixture: ComponentFixture<SipTrunkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SipTrunkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SipTrunkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
