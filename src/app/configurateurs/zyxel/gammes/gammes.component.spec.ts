import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GammesComponent } from './gammes.component';

describe('GammesComponent', () => {
  let component: GammesComponent;
  let fixture: ComponentFixture<GammesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GammesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GammesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
