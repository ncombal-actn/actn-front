import { TestBed } from '@angular/core/testing';

import { PanierValidationGuard } from './panier-validation.guard';

describe('IsPanierEmptyGuard', () => {
  let guard: PanierValidationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PanierValidationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
