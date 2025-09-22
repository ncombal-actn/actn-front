import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MdpChangementComponent } from './mdp-changement.component';

describe('MdpChangementComponent', () => {
  let component: MdpChangementComponent;
  let fixture: ComponentFixture<MdpChangementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MdpChangementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdpChangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
