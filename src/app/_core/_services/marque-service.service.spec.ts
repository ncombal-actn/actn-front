import { TestBed } from '@angular/core/testing';

import { MarqueServiceService } from './marque-service.service';

describe('MarqueServiceService', () => {
  let service: MarqueServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarqueServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
