import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { HasValidQueryParametersGuard } from './has-valid-query-parameters.guard';

describe('HasValidQueryParametersGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HasValidQueryParametersGuard]
    });
  });

  it('should ...', inject([HasValidQueryParametersGuard], (guard: HasValidQueryParametersGuard) => {
    expect(guard).toBeTruthy();
  }));
});
