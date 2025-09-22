import { TestBed } from '@angular/core/testing';

import { PrestationsService } from './prestations.service';

describe('PrestationsService', () => {
  let service: PrestationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrestationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
