import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NosOffresComponent } from './nos-offres.component';

describe('NosOffresComponent', () => {
  let component: NosOffresComponent;
  let fixture: ComponentFixture<NosOffresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NosOffresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NosOffresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
