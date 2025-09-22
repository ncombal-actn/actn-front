import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentManquantComponent } from './document-manquant.component';

describe('DocumentManquantComponent', () => {
  let component: DocumentManquantComponent;
  let fixture: ComponentFixture<DocumentManquantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentManquantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentManquantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
