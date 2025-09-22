import { TestBed } from '@angular/core/testing';

import { ObjDisplayGuard } from './obj-display.guard';

describe('ObjDisplayGuard', () => {
  let guard: ObjDisplayGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ObjDisplayGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
