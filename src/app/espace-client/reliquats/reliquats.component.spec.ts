import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReliquatsComponent } from './reliquats.component';

describe('ReliquatsComponent', () => {
  let component: ReliquatsComponent;
  let fixture: ComponentFixture<ReliquatsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReliquatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReliquatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
