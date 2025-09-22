import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizonDelaisComponent } from './horizon-delais.component';

describe('HorizonDelaisComponent', () => {
  let component: HorizonDelaisComponent;
  let fixture: ComponentFixture<HorizonDelaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HorizonDelaisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorizonDelaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
