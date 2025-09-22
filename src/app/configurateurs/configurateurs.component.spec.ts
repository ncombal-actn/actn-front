import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurateursComponent } from './configurateurs.component';

describe('ConfigurateursComponent', () => {
  let component: ConfigurateursComponent;
  let fixture: ComponentFixture<ConfigurateursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurateursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
