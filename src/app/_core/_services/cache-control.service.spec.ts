import { TestBed } from '@angular/core/testing';

import { CacheControlService } from './cache-control.service';

describe('CacheControlService', () => {
  let service: CacheControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
