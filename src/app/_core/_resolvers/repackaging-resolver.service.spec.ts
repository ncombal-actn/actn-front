import { TestBed } from '@angular/core/testing';

import { RepackagingResolverService } from './repackaging-resolver.service';

describe('RepackagingResolverService', () => {
  let service: RepackagingResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepackagingResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
