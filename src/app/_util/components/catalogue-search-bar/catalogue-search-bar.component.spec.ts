import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CatalogueSearchBarComponent } from './catalogue-search-bar.component';

describe('CatalogueSearchBarComponent', () => {
  let component: CatalogueSearchBarComponent;
  let fixture: ComponentFixture<CatalogueSearchBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogueSearchBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
