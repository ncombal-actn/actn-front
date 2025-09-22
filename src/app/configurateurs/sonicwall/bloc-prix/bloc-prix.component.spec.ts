import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocPrixComponent } from './bloc-prix.component';

describe('BlocPrixComponent', () => {
  let component: BlocPrixComponent;
  let fixture: ComponentFixture<BlocPrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlocPrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlocPrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
