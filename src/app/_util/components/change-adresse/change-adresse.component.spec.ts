import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChangeAdresseComponent } from './change-adresse.component';

describe('ChangeAdresseComponent', () => {
  let component: ChangeAdresseComponent;
  let fixture: ComponentFixture<ChangeAdresseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeAdresseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeAdresseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
