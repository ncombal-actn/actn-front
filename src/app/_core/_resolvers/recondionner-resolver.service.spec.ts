import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { recondionnerResolver } from './recondionner.resolver';

describe('recondionnerResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => recondionnerResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
