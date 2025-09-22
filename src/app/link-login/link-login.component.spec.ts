import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkLoginComponent } from './link-login.component';

describe('LinkLoginComponent', () => {
  let component: LinkLoginComponent;
  let fixture: ComponentFixture<LinkLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
