import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { specialsResolver } from './specials.resolver';

describe('specialsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => specialsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
