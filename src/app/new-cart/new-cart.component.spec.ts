import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCartComponent } from './new-cart.component';

describe('NewCartComponent', () => {
  let component: NewCartComponent;
  let fixture: ComponentFixture<NewCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewCartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
