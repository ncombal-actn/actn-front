import { TestBed } from '@angular/core/testing';

import { DematerialisationService } from './dematerialisation.service';

describe('DematerialisationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DematerialisationService = TestBed.get(DematerialisationService);
    expect(service).toBeTruthy();
  });
});
