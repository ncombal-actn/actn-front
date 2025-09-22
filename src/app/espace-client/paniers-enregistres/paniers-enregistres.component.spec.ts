import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaniersEnregistresComponent } from './paniers-enregistres.component';

describe('PaniersEnregistresComponent', () => {
  let component: PaniersEnregistresComponent;
  let fixture: ComponentFixture<PaniersEnregistresComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaniersEnregistresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaniersEnregistresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
