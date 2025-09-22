import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedureTicketComponent } from './procedure-ticket.component';

describe('ProcedureTicketComponent', () => {
  let component: ProcedureTicketComponent;
  let fixture: ComponentFixture<ProcedureTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcedureTicketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcedureTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
