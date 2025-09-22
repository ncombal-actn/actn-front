import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContratModificationComponent } from './contrat-modification.component';

describe('ContratModificationComponent', () => {
  let component: ContratModificationComponent;
  let fixture: ComponentFixture<ContratModificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContratModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
