import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilDArianneComponent } from './fil-d-arianne.component';

describe('FilDArianneComponent', () => {
  let component: FilDArianneComponent;
  let fixture: ComponentFixture<FilDArianneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilDArianneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilDArianneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
