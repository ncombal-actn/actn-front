import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { promoResolver } from './promo.resolver';

describe('promoResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...promoParameters) =>
      TestBed.runInInjectionContext(() => promoResolver(...promoParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
