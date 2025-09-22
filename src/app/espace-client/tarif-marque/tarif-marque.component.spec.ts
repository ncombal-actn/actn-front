import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TarifMarqueComponent } from './tarif-marque.component';

describe('TarifMarqueComponent', () => {
  let component: TarifMarqueComponent;
  let fixture: ComponentFixture<TarifMarqueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TarifMarqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarifMarqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
