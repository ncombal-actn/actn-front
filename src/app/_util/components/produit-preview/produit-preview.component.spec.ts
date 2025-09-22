import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProduitPreviewComponent } from './produit-preview.component';

describe('ProduitPreviewComponent', () => {
  let component: ProduitPreviewComponent;
  let fixture: ComponentFixture<ProduitPreviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProduitPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduitPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
