import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdpRecuperationComponent } from './mdp-recuperation.component';

describe('MdpRecuperationComponent', () => {
  let component: MdpRecuperationComponent;
  let fixture: ComponentFixture<MdpRecuperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdpRecuperationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdpRecuperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
