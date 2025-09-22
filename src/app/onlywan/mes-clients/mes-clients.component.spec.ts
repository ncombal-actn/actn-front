import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesClientsComponent } from './mes-clients.component';

describe('MesClientsComponent', () => {
  let component: MesClientsComponent;
  let fixture: ComponentFixture<MesClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesClientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MesClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
